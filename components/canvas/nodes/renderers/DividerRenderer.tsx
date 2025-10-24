import React from 'react';
import { DividerComponent } from '@/types/canvas.types';

interface Props {
  data: DividerComponent;
}

export default function DividerRenderer({ data }: Props) {
  return (
    <div className="py-2">
      <div
        className="w-full rounded"
        style={{
          height: `${data.content.thickness || 2}px`,
          backgroundColor: data.content.color || '#000000',
        }}
      />
    </div>
  );
}
