'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { BlockType, HeroBlock, TextBlock, ImageBlock } from '@/types/block.types';

const blockTemplates = {
  hero: {
    type: 'hero' as BlockType,
    icon: '🎯',
    label: 'Hero Section',
    defaultContent: {
      heading: 'Welcome to Our Site',
      subheading: 'Build something amazing today',
      ctaText: 'Get Started',
      ctaLink: '#',
    },
  },
  text: {
    type: 'text' as BlockType,
    icon: '📝',
    label: 'Text Block',
    defaultContent: {
      heading: 'Section Heading',
      body: 'Add your content here. This is a text block that can be customized with your own content.',
    },
  },
  image: {
    type: 'image' as BlockType,
    icon: '🖼️',
    label: 'Image Block',
    defaultContent: {
      src: 'https://via.placeholder.com/800x400',
      alt: 'Placeholder image',
      caption: '',
    },
  },
};

export default function BlockPalette() {
  const { addBlock, blocks } = useBuilderStore();

  const handleAddBlock = (blockType: BlockType) => {
    const template = blockTemplates[blockType];
    const newBlock = {
      id: `${blockType}-${Date.now()}`,
      type: blockType,
      order: blocks.length,
      content: template.defaultContent,
    };

    if (blockType === 'hero') {
      addBlock(newBlock as HeroBlock);
    } else if (blockType === 'text') {
      addBlock(newBlock as TextBlock);
    } else if (blockType === 'image') {
      addBlock(newBlock as ImageBlock);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Block Palette</h2>
      <div className="space-y-3">
        {Object.entries(blockTemplates).map(([key, template]) => (
          <button
            key={key}
            onClick={() => handleAddBlock(template.type)}
            className="w-full p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-blue-600">
                  {template.label}
                </p>
                <p className="text-xs text-gray-500">Click to add</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Blocks on canvas:</p>
        <p className="text-2xl font-bold text-gray-800">{blocks.length}</p>
      </div>
    </div>
  );
}
