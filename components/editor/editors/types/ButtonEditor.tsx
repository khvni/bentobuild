'use client';

import React from 'react';
import { ButtonComponent } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import ColorPicker from '../../controls/ColorPicker';

interface Props {
  component: ButtonComponent;
  sectionId: string;
}

export default function ButtonEditor({ component, sectionId }: Props) {
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

  const handleVariantChange = (variant: 'filled' | 'outlined' | 'text') => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, variant },
    });
  };

  const handleColorChange = (color: string) => {
    updateComponent(sectionId, component.id, {
      style: { ...component.style, backgroundColor: color },
    });
  };

  return (
    <div className="space-y-4">
      {/* Button Text */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Text</label>
        <input
          type="text"
          value={component.content.text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
          placeholder="Enter button text..."
        />
      </div>

      {/* Button URL */}
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

      {/* Button Variant */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Variant</label>
        <div className="grid grid-cols-3 gap-2">
          {(['filled', 'outlined', 'text'] as const).map((variant) => (
            <button
              key={variant}
              onClick={() => handleVariantChange(variant)}
              className={`p-2 border-2 rounded-bauhaus-sm font-bold text-xs uppercase transition-colors ${
                component.content.variant === variant
                  ? 'bg-bauhaus-blue text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {variant}
            </button>
          ))}
        </div>
      </div>

      {/* Background Color (for filled variant) */}
      {component.content.variant === 'filled' && (
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Background</label>
          <ColorPicker
            value={component.style.backgroundColor || '#000000'}
            onChange={handleColorChange}
          />
        </div>
      )}

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Border Radius</label>
        <input
          type="text"
          value={component.style.borderRadius || ''}
          onChange={(e) => updateComponent(sectionId, component.id, {
            style: { ...component.style, borderRadius: e.target.value }
          })}
          placeholder="e.g., 8px, 50%"
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
        />
      </div>

      {/* Padding */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Padding</label>
        <input
          type="text"
          value={component.style.padding || ''}
          onChange={(e) => updateComponent(sectionId, component.id, {
            style: { ...component.style, padding: e.target.value }
          })}
          placeholder="e.g., 12px 24px"
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
        />
      </div>
    </div>
  );
}
