import { NextRequest, NextResponse } from 'next/server';
import { Block } from '@/types/block.types';
import { generateStaticHTML } from '@/lib/daytonaClient';
import { Daytona } from '@daytonaio/sdk';

interface UpdatePreviewRequest {
  sandboxId: string;
  blocks: Block[];
  contextPrompt: string;
}

// Rate limiting: Track last update time per sandbox
const lastUpdateTime = new Map<string, number>();
const MIN_UPDATE_INTERVAL = 2000; // 2 seconds minimum between updates

/**
 * POST /api/update-preview
 *
 * Updates the preview HTML in an existing Daytona sandbox
 * Implements rate limiting and validation
 */
export async function POST(request: NextRequest) {
  try {
    const body: UpdatePreviewRequest = await request.json();
    const { sandboxId, blocks, contextPrompt } = body;

    // Validation
    if (!sandboxId || typeof sandboxId !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid sandboxId' }, { status: 400 });
    }

    if (!Array.isArray(blocks)) {
      return NextResponse.json({ success: false, error: 'Invalid blocks array' }, { status: 400 });
    }

    // Rate limiting check
    const now = Date.now();
    const lastUpdate = lastUpdateTime.get(sandboxId);

    if (lastUpdate && now - lastUpdate < MIN_UPDATE_INTERVAL) {
      const remainingTime = MIN_UPDATE_INTERVAL - (now - lastUpdate);
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit: Please wait ${Math.ceil(remainingTime / 1000)} seconds`,
          retryAfter: remainingTime,
        },
        { status: 429 }
      );
    }

    // Update rate limit timestamp
    lastUpdateTime.set(sandboxId, now);

    // Clean up old entries (older than 1 hour)
    for (const [id, timestamp] of lastUpdateTime.entries()) {
      if (now - timestamp > 3600000) {
        lastUpdateTime.delete(id);
      }
    }

    // Check if Daytona API key is configured
    const apiKey = process.env.DAYTONA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'DAYTONA_API_KEY not configured',
          isMock: true,
        },
        { status: 503 }
      );
    }

    // Generate updated HTML
    const html = generateStaticHTML(blocks, contextPrompt);

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
          sandboxGone: true,
        },
        { status: 404 }
      );
    }

    // Update the index.html file
    try {
      await sandbox.fs.uploadFile(Buffer.from(html, 'utf-8'), 'public/index.html');
      console.log('✓ Updated index.html successfully');
    } catch (uploadError) {
      console.error('❌ Failed to upload HTML:', uploadError);
      return NextResponse.json(
        {
          success: false,
          error: uploadError instanceof Error ? uploadError.message : 'Failed to update file',
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
        error: error instanceof Error ? error.message : 'Failed to update preview',
      },
      { status: 500 }
    );
  }
}
