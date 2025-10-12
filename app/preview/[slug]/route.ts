import { NextRequest, NextResponse } from 'next/server';
import { getPreview } from '@/lib/previewCache';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const preview = getPreview(slug);

  if (!preview) {
    return NextResponse.json({ error: 'Preview expired or not found' }, { status: 404 });
  }

  return new NextResponse(preview.html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
