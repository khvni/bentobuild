import React from 'react';
import { ImageComponent } from '@/types/canvas.types';
import { ImageIcon } from 'lucide-react';

interface Props {
  data: ImageComponent;
}

export default function ImageRenderer({ data }: Props) {
  return (
    <div className="space-y-2">
      <div className="relative w-full h-32 bg-gray-100 rounded-bauhaus-md border-2 border-gray-300 overflow-hidden flex items-center justify-center">
        {data.content.src ? (
          <img
            src={data.content.src}
            alt={data.content.alt || 'Image'}
            className="w-full h-full object-cover"
            style={{ objectFit: data.content.objectFit || 'cover' }}
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-gray-400" />
        )}
      </div>
      {data.content.caption && (
        <p className="text-xs text-gray-600 italic text-center">{data.content.caption}</p>
      )}
    </div>
  );
}
