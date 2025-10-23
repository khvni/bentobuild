import { NextRequest, NextResponse } from 'next/server';
import { Block } from '@/types/block.types';
import { generateStaticHTML } from '@/lib/daytonaClient';
import { Daytona } from '@daytonaio/sdk';
import { secureApi } from '@/lib/middleware/apiWrapper';
import { sanitizeBlockContent, sanitizeAIPrompt } from '@/lib/security/sanitize';

interface UpdatePreviewRequest {
  sandboxId: string;
  blocks: Block[];
  contextPrompt: string;
}

/**
 * POST /api/update-preview
 *
 * Updates the preview HTML in an existing Daytona sandbox
 * Implements rate limiting and validation
 */
async function handlePOST(request: NextRequest) {
  try {
    const body: UpdatePreviewRequest = await request.json();
    let { sandboxId, blocks, contextPrompt } = body;

    // Validation
    if (!sandboxId || typeof sandboxId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid sandboxId' },
        { status: 400 }
      );
    }

    if (!Array.isArray(blocks)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blocks array' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    if (contextPrompt) {
      contextPrompt = sanitizeAIPrompt(contextPrompt);
    }

    // Sanitize blocks content
    const sanitizedBlocks = blocks.map((block: Block) => ({
      ...block,
      content: sanitizeBlockContent(block.content),
    } as Block));

    // Check if Daytona API key is configured
    const apiKey = process.env.DAYTONA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'DAYTONA_API_KEY not configured',
          isMock: true
        },
        { status: 503 }
      );
    }

    // Generate updated HTML
    const html = generateStaticHTML(sanitizedBlocks, contextPrompt);

    console.log('🔄 Updating preview for sandbox:', sandboxId);
    console.log('📦 Blocks count:', blocks.length);
    console.log('📄 HTML size:', html.length, 'bytes');

    // Initialize Daytona SDK
    const daytona = new Daytona({ apiKey });

    // Get the existing sandbox
    let sandbox;
    try {
      sandbox = await daytona.get(sandboxId);
      console.log('✓ Sandbox found:', sandboxId);
    } catch (getError) {
      console.error('❌ Failed to get sandbox:', getError);
      return NextResponse.json(
        {
          success: false,
          error: 'Sandbox not found or no longer exists',
          sandboxGone: true
        },
        { status: 404 }
      );
    }

    // Update the index.html file
    try {
      await sandbox.fs.uploadFile(
        Buffer.from(html, 'utf-8'),
        'public/index.html'
      );
      console.log('✓ Updated index.html successfully');
    } catch (uploadError) {
      console.error('❌ Failed to upload HTML:', uploadError);
      return NextResponse.json(
        {
          success: false,
          error: uploadError instanceof Error ? uploadError.message : 'Failed to update file'
        },
        { status: 500 }
      );
    }

    const timestamp = new Date().toISOString();
    console.log('✅ Preview sync completed at', timestamp);

    return NextResponse.json({
      success: true,
      timestamp,
      blocksCount: blocks.length,
    });

  } catch (error) {
    console.error('❌ Update preview error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update preview'
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
