'use client';

import React from 'react';
import { LayoutType } from '@/types/canvas.types';
import { Grid3x3, Layers, Move } from 'lucide-react';

interface LayoutPickerProps {
  value: LayoutType;
  onChange: (type: LayoutType) => void;
}

export default function LayoutPicker({ value, onChange }: LayoutPickerProps) {
  const layouts: { type: LayoutType; icon: React.ReactNode; label: string }[] = [
    { type: 'stack', icon: <Layers className="w-5 h-5" />, label: 'Stack' },
    { type: 'grid', icon: <Grid3x3 className="w-5 h-5" />, label: 'Grid' },
    { type: 'absolute', icon: <Move className="w-5 h-5" />, label: 'Absolute' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {layouts.map((layout) => (
        <button
          key={layout.type}
          onClick={() => onChange(layout.type)}
          className={`p-3 border-2 rounded-bauhaus-md flex flex-col items-center gap-1 transition-colors ${
            value === layout.type
              ? 'bg-bauhaus-blue text-white border-black'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          {layout.icon}
          <span className="text-xs font-bold uppercase">{layout.label}</span>
        </button>
      ))}
    </div>
  );
}
