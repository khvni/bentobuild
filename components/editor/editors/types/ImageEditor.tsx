'use client';

import React from 'react';
import { ImageComponent } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';

interface Props {
  component: ImageComponent;
  sectionId: string;
}

export default function ImageEditor({ component, sectionId }: Props) {
  const { updateComponent } = useBuilderStore();

  const handleSrcChange = (src: string) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, src },
    });
  };

  const handleAltChange = (alt: string) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, alt },
    });
  };

  const handleCaptionChange = (caption: string) => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, caption },
    });
  };

  const handleObjectFitChange = (objectFit: 'cover' | 'contain' | 'fill') => {
    updateComponent(sectionId, component.id, {
      content: { ...component.content, objectFit },
    });
  };

  return (
    <div className="space-y-4">
      {/* Image Source */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Image URL</label>
        <input
          type="url"
          value={component.content.src}
          onChange={(e) => handleSrcChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Preview */}
      {component.content.src && (
        <div className="bg-gray-100 rounded-bauhaus-md p-2 border-2 border-gray-300">
          <img
            src={component.content.src}
            alt={component.content.alt}
            className="w-full h-32 object-cover rounded-bauhaus-sm"
          />
        </div>
      )}

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Alt Text</label>
        <input
          type="text"
          value={component.content.alt}
          onChange={(e) => handleAltChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
          placeholder="Describe the image..."
        />
        <p className="text-xs text-gray-600 mt-1">For accessibility and SEO</p>
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Caption</label>
        <input
          type="text"
          value={component.content.caption || ''}
          onChange={(e) => handleCaptionChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
          placeholder="Optional caption..."
        />
      </div>

      {/* Object Fit */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Object Fit</label>
        <div className="grid grid-cols-3 gap-2">
          {(['cover', 'contain', 'fill'] as const).map((fit) => (
            <button
              key={fit}
              onClick={() => handleObjectFitChange(fit)}
              className={`p-2 border-2 rounded-bauhaus-sm font-bold text-xs uppercase transition-colors ${
                component.content.objectFit === fit
                  ? 'bg-bauhaus-blue text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {fit}
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
          Border Radius
        </label>
        <input
          type="text"
          value={component.style.borderRadius || ''}
          onChange={(e) =>
            updateComponent(sectionId, component.id, {
              style: { ...component.style, borderRadius: e.target.value },
            })
          }
          placeholder="e.g., 8px, 50%"
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
        />
      </div>
    </div>
  );
}
