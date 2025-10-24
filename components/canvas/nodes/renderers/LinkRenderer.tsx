import React from 'react';
import { LinkComponent } from '@/types/canvas.types';
import { ExternalLink } from 'lucide-react';

interface Props {
  data: LinkComponent;
}

export default function LinkRenderer({ data }: Props) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-bauhaus-blue" />
        <a
          href={data.content.url}
          className="text-sm font-semibold text-bauhaus-blue hover:underline"
          onClick={(e) => e.preventDefault()}
          style={{ color: data.style.textColor }}
        >
          {data.content.text || 'Link'}
        </a>
      </div>
      {data.content.description && (
        <p className="text-xs text-gray-600 line-clamp-2">{data.content.description}</p>
      )}
    </div>
  );
}
