'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { BlockType } from '@/types/block.types';
import { useDraggable } from '@dnd-kit/core';

const blockTemplates = {
  hero: {
    type: 'hero' as BlockType,
    icon: '🎯',
    label: 'Hero Section',
    color: '#E63946', // Bauhaus Red
    defaultContent: {
      heading: 'Welcome to Our Site',
      subheading: 'Build something amazing today',
      ctaText: 'Get Started',
      ctaLink: '#',
      fontFamily: 'Instrument Serif',
      fontSize: 'medium',
    },
  },
  text: {
    type: 'text' as BlockType,
    icon: '📝',
    label: 'Text Block',
    color: '#F1C40F', // Bauhaus Yellow
    defaultContent: {
      heading: 'Section Heading',
      body: 'Add your content here. This is a text block that can be customized with your own content.',
      fontFamily: 'Instrument Serif',
      fontSize: 'medium',
    },
  },
  image: {
    type: 'image' as BlockType,
    icon: '🖼️',
    label: 'Image Block',
    color: '#2563EB', // Bauhaus Blue
    defaultContent: {
      src: 'https://via.placeholder.com/800x400',
      alt: 'Placeholder image',
      caption: '',
      fontFamily: 'Instrument Serif',
    },
  },
  button: {
    type: 'button' as BlockType,
    icon: '🔘',
    label: 'Button',
    color: '#E63946', // Bauhaus Red
    defaultContent: {
      text: 'Click Me',
      url: '#',
      style: 'filled' as const,
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
    },
  },
  link: {
    type: 'link' as BlockType,
    icon: '🔗',
    label: 'Link',
    color: '#F1C40F', // Bauhaus Yellow
    defaultContent: {
      text: 'Learn More',
      url: '#',
      description: 'Click to explore additional resources',
    },
  },
  navbar: {
    type: 'navbar' as BlockType,
    icon: '🧭',
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
    },
  },
  footer: {
    type: 'footer' as BlockType,
    icon: '🦶',
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
    },
  },
};

interface DraggableBlockTemplateProps {
  blockType: BlockType;
  template: typeof blockTemplates[keyof typeof blockTemplates];
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

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
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
          <span className="text-2xl" role="img" aria-label={template.label}>
            {template.icon}
          </span>
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
