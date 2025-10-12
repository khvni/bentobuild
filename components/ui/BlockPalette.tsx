'use client';

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { BlockType } from '@/types/block.types';
import { useDraggable } from '@dnd-kit/core';
import { Target, FileText, Image, MousePointer2, Link2, Menu, LayoutDashboard } from 'lucide-react';

const blockTemplates = {
  hero: {
    type: 'hero' as BlockType,
    icon: Target,
    label: 'Hero Section',
    color: '#E63946', // Bauhaus Red
    defaultContent: {
      heading: 'Welcome to Our Site',
      subheading: 'Build something amazing today',
      ctaText: 'Get Started',
      ctaLink: '#',
      // Typography properties
      fontFamily: 'Instrument Serif',
      fontSize: 'medium',
      // Color properties
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      buttonColor: '#FFFFFF',
      buttonTextColor: '#3B82F6',
    },
  },
  text: {
    type: 'text' as BlockType,
    icon: FileText,
    label: 'Text Block',
    color: '#F1C40F', // Bauhaus Yellow
    defaultContent: {
      heading: 'Section Heading',
      body: 'Add your content here. This is a text block that can be customized with your own content.',
      // Typography properties
      fontFamily: 'Instrument Serif',
      fontSize: 'medium',
      // Color properties
      backgroundColor: '#FFFFFF',
      headingColor: '#111827',
      textColor: '#4B5563',
    },
  },
  image: {
    type: 'image' as BlockType,
    icon: Image,
    label: 'Image Block',
    color: '#2563EB', // Bauhaus Blue
    defaultContent: {
      src: 'https://via.placeholder.com/800x400',
      alt: 'Placeholder image',
      caption: '',
      // Typography properties
      fontFamily: 'Instrument Serif',
      // Color properties
      backgroundColor: '#F9FAFB',
      captionColor: '#4B5563',
    },
  },
  button: {
    type: 'button' as BlockType,
    icon: MousePointer2,
    label: 'Button',
    color: '#E63946', // Bauhaus Red
    defaultContent: {
      text: 'Click Me',
      url: '#',
      style: 'filled' as const,
      // Typography properties
      fontFamily: 'Instrument Serif',
      // Color properties
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      borderColor: '#3B82F6',
    },
  },
  link: {
    type: 'link' as BlockType,
    icon: Link2,
    label: 'Link',
    color: '#F1C40F', // Bauhaus Yellow
    defaultContent: {
      text: 'Learn More',
      url: '#',
      description: 'Click to explore additional resources',
      // Typography properties
      fontFamily: 'Instrument Serif',
      // Color properties
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      linkColor: '#3B82F6',
    },
  },
  navbar: {
    type: 'navbar' as BlockType,
    icon: Menu,
    label: 'Navigation Bar',
    color: '#2563EB', // Bauhaus Blue
    defaultContent: {
      brandName: 'My Brand',
      logoUrl: '',
      links: [
        { text: 'Home', url: '#' },
        { text: 'About', url: '#about' },
        { text: 'Contact', url: '#contact' },
      ],
      // Typography properties
      fontFamily: 'Instrument Serif',
      fontSize: 'medium',
      // Color properties
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      linkColor: '#3B82F6',
      linkHoverColor: '#2563EB',
    },
  },
  footer: {
    type: 'footer' as BlockType,
    icon: LayoutDashboard,
    label: 'Footer',
    color: '#1F2937', // Dark Gray
    defaultContent: {
      companyName: 'My Company',
      copyright: '© 2024 My Company. All rights reserved.',
      socialLinks: [
        { platform: 'Twitter', url: 'https://twitter.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'GitHub', url: 'https://github.com' },
      ],
      contactEmail: 'contact@company.com',
      // Typography properties
      fontFamily: 'Instrument Serif',
      fontSize: 'medium',
      // Color properties
      backgroundColor: '#111827',
      textColor: '#F9FAFB',
      linkColor: '#60A5FA',
    },
  },
};

interface BlockTemplate {
  type: BlockType;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  color: string;
  defaultContent: Record<string, unknown>;
}

interface DraggableBlockTemplateProps {
  blockType: BlockType;
  template: BlockTemplate;
}

function DraggableBlockTemplate({ blockType, template }: DraggableBlockTemplateProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${blockType}`,
    data: {
      type: 'palette-item',
      blockType,
      template,
    },
  });

  const IconComponent = template.icon;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      suppressHydrationWarning
      className={`relative w-full p-4 bg-white border-l-8 rounded-bauhaus-md transition-all text-left group cursor-grab active:cursor-grabbing shadow-bauhaus-sm hover:shadow-bauhaus-md bauhaus-transition focus:ring-4 focus:ring-bauhaus-blue focus:outline-none ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      style={{ borderLeftColor: template.color }}
      aria-label={`Drag ${template.label} to add to canvas`}
      title={`Drag ${template.label} to canvas`}
    >
      {/* Color accent square */}
      <div
        className="absolute top-2 right-2 w-3 h-3 rounded-bauhaus-sm opacity-60"
        style={{ backgroundColor: template.color }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-bauhaus-sm"
          style={{ backgroundColor: `${template.color}20` }}
          aria-hidden="true"
        >
          <IconComponent className="w-6 h-6" style={{ color: template.color }} />
        </div>
        <div>
          <p className="font-bold text-gray-900 uppercase text-xs tracking-wide mb-0.5">
            {template.label}
          </p>
          <p className="text-xs text-gray-500 font-medium" aria-hidden="true">+ ADD</p>
        </div>
      </div>
    </button>
  );
}

export default function BlockPalette() {
  const { blocks } = useBuilderStore();

  return (
    <nav
      className="w-72 bg-gray-50 border-r-4 border-black p-6 overflow-y-auto relative bauhaus-accent-line"
      role="navigation"
      aria-label="Block palette"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="bauhaus-h3 uppercase tracking-wider text-black mb-1">Blocks</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-bauhaus-red to-bauhaus-yellow rounded-full" aria-hidden="true"></div>
      </div>

      {/* Block Templates */}
      <div className="space-y-3" role="menu" aria-label="Available block types">
        {Object.entries(blockTemplates).map(([key, template]) => (
          <DraggableBlockTemplate
            key={key}
            blockType={template.type}
            template={template}
          />
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-8 pt-6 border-t-2 border-gray-300" role="status" aria-label="Canvas statistics">
        <div className="bg-white rounded-bauhaus-md p-4 shadow-bauhaus-sm border-2 border-black">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Canvas</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-black" aria-label={`${blocks.length} blocks`}>{blocks.length}</p>
            <p className="text-sm font-semibold text-gray-500 uppercase">Blocks</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
