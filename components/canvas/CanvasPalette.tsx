'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useBuilderStore } from '@/store/useBuilderStore';
import {
  Target,
  FileText,
  Image as ImageIcon,
  MousePointer2,
  Link2,
  Menu,
  LayoutDashboard,
  Type,
  Square,
  Minus,
} from 'lucide-react';
import { SectionVariant, ComponentType } from '@/types/canvas.types';

// Section Templates
const sectionTemplates = [
  { variant: 'navbar' as SectionVariant, label: 'Navigation', icon: Menu, color: '#2563EB' },
  { variant: 'hero' as SectionVariant, label: 'Hero', icon: Target, color: '#E63946' },
  { variant: 'content' as SectionVariant, label: 'Content', icon: FileText, color: '#4B5563' },
  {
    variant: 'features' as SectionVariant,
    label: 'Features',
    icon: LayoutDashboard,
    color: '#8B5CF6',
  },
  { variant: 'gallery' as SectionVariant, label: 'Gallery', icon: ImageIcon, color: '#10B981' },
  {
    variant: 'testimonials' as SectionVariant,
    label: 'Testimonials',
    icon: FileText,
    color: '#F59E0B',
  },
  { variant: 'cta' as SectionVariant, label: 'Call to Action', icon: Target, color: '#EC4899' },
  { variant: 'footer' as SectionVariant, label: 'Footer', icon: LayoutDashboard, color: '#1F2937' },
];

// Component Templates
const componentTemplates = [
  { type: 'heading' as ComponentType, label: 'Heading', icon: Type, color: '#3B82F6' },
  { type: 'text' as ComponentType, label: 'Text', icon: FileText, color: '#6B7280' },
  { type: 'button' as ComponentType, label: 'Button', icon: MousePointer2, color: '#E63946' },
  { type: 'image' as ComponentType, label: 'Image', icon: ImageIcon, color: '#10B981' },
  { type: 'link' as ComponentType, label: 'Link', icon: Link2, color: '#3B82F6' },
  { type: 'spacer' as ComponentType, label: 'Spacer', icon: Square, color: '#9CA3AF' },
  { type: 'divider' as ComponentType, label: 'Divider', icon: Minus, color: '#4B5563' },
];

interface DraggableItemProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  data: {
    type: 'section' | 'component';
    variant?: SectionVariant;
    componentType?: ComponentType;
  };
}

function DraggableItem({ id, label, icon: Icon, color, data }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        relative w-full p-3 bg-white border-l-4 rounded-bauhaus-md
        transition-all text-left group cursor-grab active:cursor-grabbing
        shadow-bauhaus-sm hover:shadow-bauhaus-md bauhaus-transition
        focus:ring-2 focus:ring-bauhaus-blue focus:outline-none
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      style={{ borderLeftColor: color }}
      aria-label={`Drag ${label} to add to canvas`}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 flex items-center justify-center rounded-bauhaus-sm"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-gray-900">{label}</span>
      </div>
    </button>
  );
}

export default function CanvasPalette() {
  const { page } = useBuilderStore();
  const sectionCount = page?.sections.length || 0;
  const componentCount = page?.sections.reduce((acc, s) => acc + s.children.length, 0) || 0;

  return (
    <nav
      className="w-72 bg-gray-50 border-r-4 border-black p-6 overflow-y-auto bauhaus-accent-line"
      role="navigation"
      aria-label="Canvas palette"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="bauhaus-h3 uppercase tracking-wider text-black mb-1">Palette</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-bauhaus-red to-bauhaus-yellow rounded-full" />
      </div>

      {/* Sections Category */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">Sections</h3>
        <div className="space-y-2">
          {sectionTemplates.map((template) => (
            <DraggableItem
              key={template.variant}
              id={`section-${template.variant}`}
              label={template.label}
              icon={template.icon}
              color={template.color}
              data={{
                type: 'section',
                variant: template.variant,
              }}
            />
          ))}
        </div>
      </div>

      {/* Components Category */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
          Components
        </h3>
        <div className="space-y-2">
          {componentTemplates.map((template) => (
            <DraggableItem
              key={template.type}
              id={`component-${template.type}`}
              label={template.label}
              icon={template.icon}
              color={template.color}
              data={{
                type: 'component',
                componentType: template.type,
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="pt-6 border-t-2 border-gray-300">
        <div className="bg-white rounded-bauhaus-md p-4 shadow-bauhaus-sm border-2 border-black">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Canvas</p>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-black">{sectionCount}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase">Sections</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-black">{componentCount}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase">Components</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
