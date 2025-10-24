/**
 * Export/Preview API Endpoint
 *
 * Generates HTML from Page data and creates a preview URL
 * Supports the new Page/Section/Component architecture
 *
 * @module app/api/export-preview/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { secureApi } from '@/lib/middleware/apiWrapper';
import { exportToHTML } from '@/lib/export/htmlExporter';
import { validatePageForExport } from '@/lib/export/exportValidator';
import { storePreview } from '@/lib/previewCache';
import { Page } from '@/types/canvas.types';

/**
 * POST handler for export-preview
 *
 * Accepts a Page object and returns a preview URL
 */
async function handlePOST(request: NextRequest) {
  console.log('=== Export Preview API Called ===');
  console.log('Timestamp:', new Date().toISOString());

  try {
    const body = await request.json();
    const { page } = body;

    console.log('Request payload:');
    console.log('  - Page ID:', page?.id);
    console.log('  - Number of sections:', page?.sections?.length || 0);
    console.log('  - Page title:', page?.metadata?.title);

    // Validate page data
    if (!page || typeof page !== 'object') {
      console.error('Invalid request: page is missing or invalid');
      return NextResponse.json({ success: false, error: 'Invalid page data' }, { status: 400 });
    }

    // Validate page structure
    const validation = validatePageForExport(page as Page);

    if (!validation.valid) {
      console.error('Page validation failed:', validation.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Page validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Export warnings:', validation.warnings);
    }

    console.log('Page validated successfully');

    // Export to HTML
    const html = exportToHTML(page as Page);
    console.log('HTML generated, length:', html.length);

    // Store in preview cache
    const slug = storePreview(html, page.metadata?.description || '');
    console.log('Preview stored with slug:', slug);

    // Generate preview URL
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https';
    const url = `${protocol}://${host}/preview/${slug}`;

    console.log('Preview URL:', url);
    console.log('=== Export Preview Success ===');

    return NextResponse.json({
      success: true,
      url,
      slug,
      warnings: validation.warnings,
    });
  } catch (error) {
    console.error('=== Export Preview Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Export secured API handler
 * - Rate limited to prevent abuse
 * - No auth required (for now)
 * - Request logging enabled
 */
export const POST = secureApi(handlePOST, {
  rateLimit: 'preview', // 5 requests per minute
  requireAuth: false,
  logRequests: true,
});
