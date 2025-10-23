'use client';

import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Section } from '@/types/canvas.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import {
  Menu,
  Grid3x3,
  Layers,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
} from 'lucide-react';
import InlineComponentRenderer from './InlineComponentRenderer';
import GenerateSectionModal from '@/components/ai/GenerateSectionModal';
import GenerateModal from '@/components/ai/GenerateModal';
import { useGenerateModal } from '@/hooks/useGenerateModal';

interface SectionNodeProps {
  data: Section;
  selected?: boolean;
}

const SectionNode = memo(({ data, selected }: SectionNodeProps) => {
  const { updateSection, deleteSection, selectBlock } = useBuilderStore();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const { isOpen, activeComponent, openModal, closeModal } = useGenerateModal();

  const handleAddComponent = () => {
    // Will be implemented by Agent 3
    console.log('Add component to section:', data.id);
  };

  const handleGenerateSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGenerateModal(true);
  };

  const handleChangeLayout = () => {
    // Cycle through layout types (excluding 'absolute' for simplicity)
    const layouts: ('stack' | 'grid')[] = ['stack', 'grid'];
    const currentType = data.layout.type === 'absolute' ? 'stack' : data.layout.type;
    const currentIndex = layouts.indexOf(currentType);
    const nextLayout = layouts[(currentIndex + 1) % layouts.length];

    updateSection(data.id, {
      layout: {
        ...data.layout,
        type: nextLayout,
        ...(nextLayout === 'grid' && { columns: 2 }),
      },
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete ${data.variant} section?`)) {
      deleteSection(data.id);
    }
  };

  const getVariantColor = (variant: string) => {
    const colors: Record<string, string> = {
      navbar: '#2563EB',
      hero: '#E63946',
      content: '#4B5563',
      features: '#8B5CF6',
      gallery: '#10B981',
      testimonials: '#F59E0B',
      cta: '#EC4899',
      footer: '#1F2937',
    };
    return colors[variant] || '#6B7280';
  };

  const layoutIcon = data.layout.type === 'stack' ? Layers : Grid3x3;
  const LayoutIcon = layoutIcon;

  return (
    <div
      className={`
        relative bg-white border-4 rounded-bauhaus-lg shadow-bauhaus-lg
        min-w-[800px] min-h-[200px] p-6
        transition-all duration-200
        ${selected ? 'border-bauhaus-yellow ring-4 ring-bauhaus-yellow' : 'border-black'}
      `}
      style={{
        backgroundColor: data.style.backgroundColor || '#FFFFFF',
      }}
      onClick={() => selectBlock(data.id)}
    >
      {/* Drag Handle - Top Center */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-bauhaus-yellow border-2 border-black rounded-bauhaus-sm p-2 cursor-grab active:cursor-grabbing shadow-bauhaus-sm">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 -mt-2">
        {/* Left: Section Info */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-bauhaus-sm flex items-center justify-center"
            style={{ backgroundColor: `${getVariantColor(data.variant)}20` }}
          >
            <Menu className="w-4 h-4" style={{ color: getVariantColor(data.variant) }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Section {data.order + 1}
              </span>
              <span
                className="text-xs font-bold uppercase px-2 py-0.5 rounded-bauhaus-sm"
                style={{
                  backgroundColor: getVariantColor(data.variant),
                  color: '#FFFFFF',
                }}
              >
                {data.variant}
              </span>
            </div>
            <div className="text-xs text-gray-500 font-medium mt-0.5">
              {data.children.length} component{data.children.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Generate with AI */}
          <button
            onClick={handleGenerateSection}
            className="p-2 bg-bauhaus-yellow hover:bg-yellow-400 text-black border-2 border-black rounded-bauhaus-sm transition-colors bauhaus-transition"
            title="Generate with AI"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Layout Toggle */}
          <button
            onClick={handleChangeLayout}
            className="p-2 bg-gray-100 hover:bg-bauhaus-yellow border-2 border-black rounded-bauhaus-sm transition-colors bauhaus-transition"
            title={`Layout: ${data.layout.type}`}
          >
            <LayoutIcon className="w-4 h-4" />
          </button>

          {/* Add Component */}
          <button
            onClick={handleAddComponent}
            className="p-2 bg-bauhaus-blue hover:bg-blue-600 text-white border-2 border-black rounded-bauhaus-sm transition-colors bauhaus-transition"
            title="Add Component"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Delete Section */}
          <button
            onClick={handleDelete}
            className="p-2 bg-bauhaus-red hover:bg-red-600 text-white border-2 border-black rounded-bauhaus-sm transition-colors bauhaus-transition"
            title="Delete Section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layout Preview / Component Container */}
      <div className="border-2 border-dashed border-gray-300 rounded-bauhaus-md p-4 bg-gray-50">
        <div className="text-xs font-semibold uppercase text-gray-600 mb-3">
          Layout: {data.layout.type}
          {data.layout.type === 'stack' && ` - ${data.layout.direction}`}
          {data.layout.type === 'grid' && ` - ${data.layout.columns} columns`}
        </div>

        {/* Render actual child components if they exist */}
        {data.children.length > 0 ? (
          <div
            className={
              data.layout.type === 'stack'
                ? `flex ${data.layout.direction === 'vertical' ? 'flex-col' : 'flex-row'}`
                : data.layout.type === 'grid'
                ? 'grid'
                : 'relative'
            }
            style={{
              gap: `${data.layout.gap || 16}px`,
              ...(data.layout.type === 'grid' && {
                gridTemplateColumns: `repeat(${data.layout.columns || 2}, 1fr)`,
              }),
            }}
          >
            {data.children.map((component) => (
              <InlineComponentRenderer
                key={component.id}
                data={component}
                sectionId={data.id}
                onGenerate={openModal}
              />
            ))}
          </div>
        ) : (
          /* Empty state - show layout visualization */
          <>
            {data.layout.type === 'stack' && (
              <div className={`flex ${data.layout.direction === 'vertical' ? 'flex-col' : 'flex-row'} gap-2`}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded h-8 flex-1 border border-gray-300" />
                ))}
              </div>
            )}

            {data.layout.type === 'grid' && (
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${data.layout.columns || 2}, 1fr)` }}
              >
                {[1, 2, 3, 4].slice(0, (data.layout.columns || 2) * 2).map((i) => (
                  <div key={i} className="bg-gray-200 rounded h-16 border border-gray-300" />
                ))}
              </div>
            )}

            <div className="text-center mt-4 text-sm text-gray-500 font-medium">
              Drop components here or click + to add
            </div>
          </>
        )}
      </div>

      {/* Accent Line */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 rounded-b-bauhaus-lg"
        style={{ backgroundColor: getVariantColor(data.variant) }}
      />

      {/* ReactFlow Handles (for future connections) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-bauhaus-blue border-2 border-black"
        style={{ bottom: -8 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-bauhaus-yellow border-2 border-black"
        style={{ top: -8 }}
      />

      {/* Component Generation Modal */}
      {isOpen && activeComponent && (
        <GenerateModal
          component={activeComponent.component}
          sectionId={activeComponent.sectionId}
          onClose={closeModal}
        />
      )}

      {/* Section Generation Modal */}
      {showGenerateModal && (
        <GenerateSectionModal
          sectionId={data.id}
          sectionVariant={data.variant}
          onClose={() => setShowGenerateModal(false)}
        />
      )}
    </div>
  );
});

SectionNode.displayName = 'SectionNode';

export default SectionNode;
