'use client';

import React from 'react';
import { Section, LayoutType, StackDirection } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { X, Layout as LayoutIcon, Trash2, Sparkles } from 'lucide-react';
import ColorPicker from '../controls/ColorPicker';
import LayoutPicker from '../controls/LayoutPicker';

interface Props {
  section: Section;
  onClose: () => void;
}

export default function SectionEditor({ section, onClose }: Props) {
  const { updateSection, deleteSection } = useBuilderStore();

  const handleLayoutChange = (type: LayoutType) => {
    updateSection(section.id, {
      layout: {
        ...section.layout,
        type,
        ...(type === 'grid' && { columns: 2 }),
      },
    });
  };

  const handleDirectionChange = (direction: StackDirection) => {
    updateSection(section.id, {
      layout: { ...section.layout, direction },
    });
  };

  const handleColorChange = (color: string) => {
    updateSection(section.id, {
      style: { ...section.style, backgroundColor: color },
    });
  };

  const handleDelete = () => {
    if (confirm('Delete this section and all its components?')) {
      deleteSection(section.id);
      onClose();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutIcon className="w-5 h-5 text-bauhaus-blue" />
          <h3 className="bauhaus-h4 uppercase">Section Settings</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-bauhaus-sm transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Section Info */}
      <div className="bg-white rounded-bauhaus-md p-4 mb-4 border-2 border-black">
        <div className="text-xs font-bold uppercase text-gray-600 mb-1">Type</div>
        <div className="text-sm font-bold uppercase text-bauhaus-blue">{section.variant}</div>
      </div>

      {/* Layout Controls */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Layout</label>
        <LayoutPicker
          value={section.layout.type}
          onChange={handleLayoutChange}
        />

        {section.layout.type === 'stack' && (
          <div className="mt-3">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Direction</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleDirectionChange('vertical')}
                className={`flex-1 p-2 border-2 rounded-bauhaus-sm font-bold text-xs uppercase transition-colors ${
                  section.layout.direction === 'vertical'
                    ? 'bg-bauhaus-blue text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                Vertical
              </button>
              <button
                onClick={() => handleDirectionChange('horizontal')}
                className={`flex-1 p-2 border-2 rounded-bauhaus-sm font-bold text-xs uppercase transition-colors ${
                  section.layout.direction === 'horizontal'
                    ? 'bg-bauhaus-blue text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                Horizontal
              </button>
            </div>
          </div>
        )}

        {section.layout.type === 'grid' && (
          <div className="mt-3">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Columns</label>
            <input
              type="number"
              min="1"
              max="4"
              value={section.layout.columns || 2}
              onChange={(e) => updateSection(section.id, {
                layout: { ...section.layout, columns: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
            />
          </div>
        )}
      </div>

      {/* Gap Control */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Gap</label>
        <input
          type="number"
          min="0"
          max="100"
          value={section.layout.gap || 16}
          onChange={(e) => updateSection(section.id, {
            layout: { ...section.layout, gap: parseInt(e.target.value) }
          })}
          className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm"
        />
        <p className="text-xs text-gray-600 mt-1">Spacing between components (px)</p>
      </div>

      {/* Style Controls */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Background</label>
        <ColorPicker
          value={section.style.backgroundColor || '#FFFFFF'}
          onChange={handleColorChange}
        />
      </div>

      {/* Component Count */}
      <div className="bg-white rounded-bauhaus-md p-4 mb-4 border-2 border-black">
        <div className="text-xs font-bold uppercase text-gray-600 mb-1">Components</div>
        <div className="text-2xl font-bold text-black">{section.children.length}</div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          className="w-full px-4 py-2 bg-bauhaus-yellow hover:bg-yellow-400 text-black font-bold uppercase text-sm rounded-bauhaus-md border-2 border-black transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Generate Content
        </button>
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold uppercase text-sm rounded-bauhaus-md border-2 border-black transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Section
        </button>
      </div>
    </div>
  );
}
