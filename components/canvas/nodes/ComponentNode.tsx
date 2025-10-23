'use client';

import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { Component } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Copy, Trash2, GripVertical } from 'lucide-react';
import HeadingRenderer from './renderers/HeadingRenderer';
import TextRenderer from './renderers/TextRenderer';
import ButtonRenderer from './renderers/ButtonRenderer';
import ImageRenderer from './renderers/ImageRenderer';
import LinkRenderer from './renderers/LinkRenderer';
import SpacerRenderer from './renderers/SpacerRenderer';
import DividerRenderer from './renderers/DividerRenderer';

interface ComponentNodeProps {
  data: Component & { parentSectionId?: string };
  selected?: boolean;
}

const ComponentNode = memo(({ data, selected }: ComponentNodeProps) => {
  const { deleteComponent, selectBlock } = useBuilderStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Get parent section ID from data or ReactFlow
    const parentId = data.parentSectionId;

    if (parentId && confirm('Delete this component?')) {
      deleteComponent(parentId, data.id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Duplicate component:', data.id);
    // Will be implemented by drag-and-drop agent
  };

  const renderComponent = () => {
    switch (data.type) {
      case 'heading':
        return <HeadingRenderer data={data} />;
      case 'text':
        return <TextRenderer data={data} />;
      case 'button':
        return <ButtonRenderer data={data} />;
      case 'image':
        return <ImageRenderer data={data} />;
      case 'link':
        return <LinkRenderer data={data} />;
      case 'spacer':
        return <SpacerRenderer data={data} />;
      case 'divider':
        return <DividerRenderer data={data} />;
      default:
        return <div className="text-xs text-gray-400">Unknown component</div>;
    }
  };

  return (
    <div
      className={`
        group relative bg-white border-2 rounded-bauhaus-md shadow-bauhaus-sm
        p-3 transition-all duration-200
        hover:shadow-bauhaus-md
        ${selected ? 'border-bauhaus-yellow ring-2 ring-bauhaus-yellow' : 'border-gray-300'}
      `}
      style={{
        backgroundColor: data.style.backgroundColor,
      }}
      onClick={() => selectBlock(data.id)}
    >
      {/* Drag Handle - Only shows on hover or selection */}
      <div
        className={`
          absolute -left-3 top-1/2 -translate-y-1/2
          bg-gray-200 border-2 border-gray-400 rounded-bauhaus-sm
          p-1 cursor-grab active:cursor-grabbing
          transition-opacity duration-200
          ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        <GripVertical className="w-3 h-3" />
      </div>

      {/* Quick Actions - Top right */}
      <div
        className={`
          absolute -top-2 -right-2 flex gap-1
          transition-opacity duration-200
          ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        <button
          onClick={handleDuplicate}
          className="p-1 bg-bauhaus-blue hover:bg-blue-600 text-white border-2 border-black rounded-bauhaus-sm transition-colors shadow-bauhaus-sm"
          title="Duplicate"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 bg-bauhaus-red hover:bg-red-600 text-white border-2 border-black rounded-bauhaus-sm transition-colors shadow-bauhaus-sm"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Component Type Badge */}
      <div className="absolute -top-2 -left-2 bg-black text-white text-xs font-bold uppercase px-2 py-0.5 rounded-bauhaus-sm">
        {data.type}
      </div>

      {/* Render Component Content */}
      <div className="mt-2">
        {renderComponent()}
      </div>
    </div>
  );
});

ComponentNode.displayName = 'ComponentNode';

export default ComponentNode;
