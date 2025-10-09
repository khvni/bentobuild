'use client';

import { HeroBlock as HeroBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { motion } from 'framer-motion';

interface HeroBlockProps {
  block: HeroBlockType;
}

export default function HeroBlock({ block }: HeroBlockProps) {
  const { updateBlock } = useBuilderStore();

  const handleContentChange = (field: keyof HeroBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
    >
      <div className="max-w-3xl mx-auto text-center">
        <input
          type="text"
          className="w-full bg-transparent text-5xl font-bold mb-4 border-b-2 border-transparent hover:border-white focus:border-white focus:outline-none text-center"
          value={block.content.heading}
          onChange={(e) => handleContentChange('heading', e.target.value)}
          placeholder="Hero Heading"
        />
        <input
          type="text"
          className="w-full bg-transparent text-xl mb-8 border-b-2 border-transparent hover:border-white focus:border-white focus:outline-none text-center"
          value={block.content.subheading}
          onChange={(e) => handleContentChange('subheading', e.target.value)}
          placeholder="Hero Subheading"
        />
        <div className="flex gap-4 justify-center items-center">
          <input
            type="text"
            className="bg-transparent text-white px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-center"
            value={block.content.ctaText}
            onChange={(e) => handleContentChange('ctaText', e.target.value)}
            placeholder="CTA Text"
          />
          <input
            type="text"
            className="bg-transparent text-sm px-3 py-1 border border-white/50 rounded text-center"
            value={block.content.ctaLink}
            onChange={(e) => handleContentChange('ctaLink', e.target.value)}
            placeholder="CTA Link"
          />
        </div>
      </div>
    </motion.div>
  );
}
