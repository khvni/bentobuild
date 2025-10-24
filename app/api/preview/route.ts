import { NextRequest, NextResponse } from 'next/server';
import { createPreview } from '@/lib/daytonaClient';
import { Block } from '@/types/block.types';
import { secureApi } from '@/lib/middleware/apiWrapper';
import { sanitizeBlockContent, sanitizeAIPrompt } from '@/lib/security/sanitize';

async function handlePOST(request: NextRequest) {
  console.log('=== Preview API Route Called ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Environment:', process.env.NODE_ENV || 'development');

  try {
    const body = await request.json();
    let { blocks, contextPrompt } = body;

    console.log('Request payload:');
    console.log('  - Number of blocks:', Array.isArray(blocks) ? blocks.length : 'N/A');
    console.log('  - Context prompt length:', contextPrompt ? contextPrompt.length : 0);
    console.log(
      '  - Block types:',
      Array.isArray(blocks) ? blocks.map((b: Block) => b.type).join(', ') : 'N/A'
    );

    // Sanitize inputs
    if (contextPrompt) {
      contextPrompt = sanitizeAIPrompt(contextPrompt);
    }

    if (Array.isArray(blocks)) {
      blocks = blocks.map((block: Block) => ({
        ...block,
        content: sanitizeBlockContent(block.content),
      }));
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    console.log('  - Base URL for fallback preview:', baseUrl);

    // Validate request
    if (!Array.isArray(blocks)) {
      console.error('❌ Invalid request: blocks is not an array');
      return NextResponse.json({ success: false, error: 'Invalid blocks array' }, { status: 400 });
    }

    console.log('✓ Request validated, creating preview...');

    // Create preview
    const result = await createPreview(blocks as Block[], contextPrompt || '', baseUrl);

    console.log('Preview result:', {
      success: result.success,
      isMock: result.isMock,
      hasUrl: !!result.url,
      hasError: !!result.error,
    });

    if (result.success) {
      console.log('✅ Preview created successfully');
      if (result.isMock) {
        console.warn('⚠️ Preview is in MOCK mode');
      } else {
        console.log('🎉 Preview is LIVE on Daytona');
        console.log('Sandbox ID:', result.sandboxId);
      }
      return NextResponse.json({
        success: true,
        url: result.url,
        sandboxId: result.sandboxId,
        isMock: result.isMock || false,
        fallbackSlug: result.fallbackSlug,
      });
    } else {
      console.error('❌ Preview creation failed:', result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('=== Preview API Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }

    console.error('========================');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Export secured API handler with rate limiting
export const POST = secureApi(handlePOST, {
  rateLimit: 'preview', // 5 requests per minute for preview endpoints
  requireAuth: false, // Allow unauthenticated access for now
  logRequests: true,
});
