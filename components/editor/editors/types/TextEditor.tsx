'use client';

import React from 'react';
import { TextComponent, FontFamily } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import ColorPicker from '../../controls/ColorPicker';
import FontPicker from '../../controls/FontPicker';

interface Props {
  component: TextComponent;
  sectionId: string;
}

export default function TextEditor({ component, sectionId }: Props) {
  const { updateComponent } = useBuilderStore();

  const handleBodyChange = (body: string) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, body },
    });
  };

  const handleColorChange = (color: string) => {
    updateComponent(sectionId, component.id, {
      style: { ...component.style, textColor: color },
    });
  };

  const handleFontChange = (fontFamily: FontFamily) => {
    updateComponent(sectionId, component.id, {
      style: { ...component.style, fontFamily },
    });
  };

  return (
    <div className="space-y-4">
      {/* Text Content */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Content</label>
        <textarea
          value={component.content.body}
          onChange={(e) => handleBodyChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm min-h-[120px]"
          placeholder="Enter paragraph text..."
        />
        <p className="text-xs text-gray-600 mt-1">Rich text HTML is supported</p>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Font</label>
        <FontPicker value={component.style.fontFamily} onChange={handleFontChange} />
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Color</label>
        <ColorPicker value={component.style.textColor || '#000000'} onChange={handleColorChange} />
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
          <option value={100}>Thin (100)</option>
          <option value={200}>Extra Light (200)</option>
          <option value={300}>Light (300)</option>
          <option value={400}>Regular (400)</option>
          <option value={500}>Medium (500)</option>
          <option value={600}>Semi Bold (600)</option>
          <option value={700}>Bold (700)</option>
          <option value={800}>Extra Bold (800)</option>
          <option value={900}>Black (900)</option>
        </select>
      </div>
    </div>
  );
}
