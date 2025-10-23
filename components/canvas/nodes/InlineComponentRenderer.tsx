'use client';

import React from 'react';
import { Component } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Trash2, Sparkles } from 'lucide-react';
import HeadingRenderer from './renderers/HeadingRenderer';
import TextRenderer from './renderers/TextRenderer';
import ButtonRenderer from './renderers/ButtonRenderer';
import ImageRenderer from './renderers/ImageRenderer';
import LinkRenderer from './renderers/LinkRenderer';
import SpacerRenderer from './renderers/SpacerRenderer';
import DividerRenderer from './renderers/DividerRenderer';

interface Props {
  data: Component;
  sectionId: string;
  selected?: boolean;
  onGenerate?: (component: Component, sectionId: string) => void;
}

/**
 * InlineComponentRenderer
 *
 * Renders components inline within a section (not as separate ReactFlow nodes).
 * Used by SectionNode to display child components in their layout.
 */
export default function InlineComponentRenderer({ data, sectionId, selected, onGenerate }: Props) {
  const { deleteComponent, selectBlock } = useBuilderStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this component?')) {
      deleteComponent(sectionId, data.id);
    }
  };

  const handleGenerate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGenerate) {
      onGenerate(data, sectionId);
    }
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
        group relative bg-white border-2 rounded-bauhaus-sm shadow-sm
        p-2 transition-all duration-200
        hover:shadow-md hover:border-gray-400
        ${selected ? 'border-bauhaus-yellow ring-2 ring-bauhaus-yellow' : 'border-gray-200'}
      `}
      style={{
        backgroundColor: data.style.backgroundColor,
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(data.id);
      }}
    >
      {/* Component Type Badge */}
      <div className="absolute -top-1.5 -left-1.5 bg-black text-white text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-bauhaus-sm opacity-0 group-hover:opacity-100 transition-opacity">
        {data.type}
      </div>

      {/* Action Buttons */}
      <div className="absolute -top-1.5 -right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="p-0.5 bg-bauhaus-yellow hover:bg-yellow-400 text-black border border-black rounded-bauhaus-sm transition-colors shadow-sm"
          title="Generate with AI"
        >
          <Sparkles className="w-2.5 h-2.5" />
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="p-0.5 bg-bauhaus-red hover:bg-red-600 text-white border border-black rounded-bauhaus-sm transition-colors shadow-sm"
          title="Delete"
        >
          <Trash2 className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Render Component Content */}
      <div className="scale-75 origin-top-left">
        {renderComponent()}
      </div>
    </div>
  );
}
