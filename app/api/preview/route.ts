import { NextRequest, NextResponse } from 'next/server';
import { createPreview } from '@/lib/daytonaClient';
import { Block } from '@/types/block.types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blocks, contextPrompt } = body;

    // Validate request
    if (!Array.isArray(blocks)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blocks array' },
        { status: 400 }
      );
    }

    // Create preview
    const result = await createPreview(blocks as Block[], contextPrompt || '');

    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
        isMock: result.isMock || false,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Preview API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
