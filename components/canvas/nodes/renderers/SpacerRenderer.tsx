import React from 'react';
import { SpacerComponent } from '@/types/canvas.types';

interface Props {
  data: SpacerComponent;
}

export default function SpacerRenderer({ data }: Props) {
  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-400 font-semibold"
      style={{ height: `${data.content.height || 40}px` }}
    >
      Spacer: {data.content.height || 40}px
    </div>
  );
}
