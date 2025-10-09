'use client';

import { HeroBlock as HeroBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';

interface HeroBlockProps {
  block: HeroBlockType;
}

export default function HeroBlock({ block }: HeroBlockProps) {
  const { updateBlock, selectedBlockId, selectBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isSelected = selectedBlockId === block.id;
  const isRegenerating = regeneratingBlockId === block.id;

  const handleContentChange = (field: keyof HeroBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await regenerateBlock(block.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg cursor-pointer transition-all ${
        isSelected ? 'ring-4 ring-yellow-400' : 'hover:shadow-lg'
      }`}
      onClick={() => selectBlock(block.id)}
    >
      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-sm rounded-lg p-2 transition-all"
          title="Generate with AI"
        >
          {isRegenerating ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          )}
        </button>
      )}
      <div className="max-w-3xl mx-auto text-center">
        <input
          type="text"
          className="w-full bg-transparent text-5xl font-bold mb-4 border-b-2 border-transparent hover:border-white focus:border-white focus:outline-none text-center"
          value={block.content.heading}
          onChange={(e) => handleContentChange('heading', e.target.value)}
          placeholder="Hero Heading"
          onClick={(e) => e.stopPropagation()}
        />
        <input
          type="text"
          className="w-full bg-transparent text-xl mb-8 border-b-2 border-transparent hover:border-white focus:border-white focus:outline-none text-center"
          value={block.content.subheading}
          onChange={(e) => handleContentChange('subheading', e.target.value)}
          placeholder="Hero Subheading"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex gap-4 justify-center items-center">
          <input
            type="text"
            className="bg-transparent text-white px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-center"
            value={block.content.ctaText}
            onChange={(e) => handleContentChange('ctaText', e.target.value)}
            placeholder="CTA Text"
            onClick={(e) => e.stopPropagation()}
          />
          <input
            type="text"
            className="bg-transparent text-sm px-3 py-1 border border-white/50 rounded text-center"
            value={block.content.ctaLink}
            onChange={(e) => handleContentChange('ctaLink', e.target.value)}
            placeholder="CTA Link"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </motion.div>
  );
}
