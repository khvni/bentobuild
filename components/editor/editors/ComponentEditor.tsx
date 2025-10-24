'use client';

import React from 'react';
import { Component } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { X, Trash2, Sparkles } from 'lucide-react';
import HeadingEditor from './types/HeadingEditor';
import TextEditor from './types/TextEditor';
import ButtonEditor from './types/ButtonEditor';
import ImageEditor from './types/ImageEditor';
import LinkEditor from './types/LinkEditor';

interface Props {
  component: Component;
  sectionId: string;
  onClose: () => void;
}

export default function ComponentEditor({ component, sectionId, onClose }: Props) {
  const { deleteComponent } = useBuilderStore();

  const handleDelete = () => {
    if (confirm('Delete this component?')) {
      deleteComponent(sectionId, component.id);
      onClose();
    }
  };

  const renderEditor = () => {
    switch (component.type) {
      case 'heading':
        return <HeadingEditor component={component} sectionId={sectionId} />;
      case 'text':
        return <TextEditor component={component} sectionId={sectionId} />;
      case 'button':
        return <ButtonEditor component={component} sectionId={sectionId} />;
      case 'image':
        return <ImageEditor component={component} sectionId={sectionId} />;
      case 'link':
        return <LinkEditor component={component} sectionId={sectionId} />;
      case 'spacer':
        return (
          <div className="bg-white rounded-bauhaus-md p-4 border-2 border-black">
            <p className="text-sm text-gray-600">Spacer components have no editable content.</p>
          </div>
        );
      case 'divider':
        return (
          <div className="bg-white rounded-bauhaus-md p-4 border-2 border-black">
            <p className="text-sm text-gray-600">Divider components have no editable content.</p>
          </div>
        );
      default:
        return <div>Editor not implemented</div>;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="bauhaus-h4 uppercase">{component.type} Settings</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-bauhaus-sm">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Type-specific editor */}
      {renderEditor()}

      {/* Actions */}
      <div className="mt-6 space-y-2">
        <button className="w-full px-4 py-2 bg-bauhaus-yellow hover:bg-yellow-400 text-black font-bold uppercase text-sm rounded-bauhaus-md border-2 border-black flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </button>
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold uppercase text-sm rounded-bauhaus-md border-2 border-black flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Component
        </button>
      </div>
    </div>
  );
}
