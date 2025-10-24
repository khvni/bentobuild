'use client';

import React from 'react';
import { LinkComponent } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import ColorPicker from '../../controls/ColorPicker';

interface Props {
  component: LinkComponent;
  sectionId: string;
}

export default function LinkEditor({ component, sectionId }: Props) {
  const { updateComponent } = useBuilderStore();

  const handleTextChange = (text: string) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, text },
    });
  };

  const handleUrlChange = (url: string) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, url },
    });
  };

  const handleDescriptionChange = (description: string) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, description },
    });
  };

  const handleColorChange = (color: string) => {
    updateComponent(sectionId, component.id, {
      style: { ...component.style, textColor: color },
    });
  };

  return (
    <div className="space-y-4">
      {/* Link Text */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Text</label>
        <input
          type="text"
          value={component.content.text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
          placeholder="Enter link text..."
        />
      </div>

      {/* Link URL */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">URL</label>
        <input
          type="url"
          value={component.content.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
          placeholder="https://example.com"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Description</label>
        <input
          type="text"
          value={component.content.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
          placeholder="Optional tooltip/description..."
        />
        <p className="text-xs text-gray-600 mt-1">Shown on hover</p>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Color</label>
        <ColorPicker value={component.style.textColor || '#0000FF'} onChange={handleColorChange} />
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Size</label>
        <input
          type="text"
          value={component.style.fontSize || ''}
          onChange={(e) =>
            updateComponent(sectionId, component.id, {
              style: { ...component.style, fontSize: e.target.value },
            })
          }
          placeholder="e.g., 16px, 1rem"
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
        />
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Weight</label>
        <select
          value={component.style.fontWeight || 400}
          onChange={(e) =>
            updateComponent(sectionId, component.id, {
              style: { ...component.style, fontWeight: parseInt(e.target.value) },
            })
          }
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm font-bold bg-white"
        >
          <option value={400}>Regular (400)</option>
          <option value={500}>Medium (500)</option>
          <option value={600}>Semi Bold (600)</option>
          <option value={700}>Bold (700)</option>
        </select>
      </div>
    </div>
  );
}
