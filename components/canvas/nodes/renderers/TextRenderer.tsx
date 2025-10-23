import React from 'react';
import { TextComponent } from '@/types/canvas.types';

interface Props {
  data: TextComponent;
}

export default function TextRenderer({ data }: Props) {
  return (
    <div
      className="text-sm line-clamp-3 prose prose-sm max-w-none"
      style={{
        color: data.style.textColor,
        fontFamily: data.style.fontFamily,
      }}
      dangerouslySetInnerHTML={{ __html: data.content.body || 'Text content' }}
    />
  );
}
