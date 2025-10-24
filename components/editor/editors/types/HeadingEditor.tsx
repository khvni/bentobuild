'use client';

import React from 'react';
import { HeadingComponent, FontFamily } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import ColorPicker from '../../controls/ColorPicker';
import FontPicker from '../../controls/FontPicker';

interface Props {
  component: HeadingComponent;
  sectionId: string;
}

export default function HeadingEditor({ component, sectionId }: Props) {
  const { updateComponent } = useBuilderStore();

  const handleTextChange = (text: string) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, text },
    });
  };

  const handleLevelChange = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, level },
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
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Text</label>
        <textarea
          value={component.content.text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm min-h-[80px]"
          placeholder="Enter heading text..."
        />
      </div>

      {/* Heading Level */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Level</label>
        <div className="grid grid-cols-6 gap-2">
          {([1, 2, 3, 4, 5, 6] as const).map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level)}
              className={`p-2 border-2 rounded-bauhaus-sm font-bold text-xs uppercase transition-colors ${
                component.content.level === level
                  ? 'bg-bauhaus-blue text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              H{level}
            </button>
          ))}
        </div>
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
          placeholder="e.g., 32px, 2rem"
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
