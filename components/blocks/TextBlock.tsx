'use client';

import { TextBlock as TextBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';

interface TextBlockProps {
  block: TextBlockType;
}

export default function TextBlock({ block }: TextBlockProps) {
  const { updateBlock, selectedBlockId, selectBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isSelected = selectedBlockId === block.id;
  const isRegenerating = regeneratingBlockId === block.id;

  const handleContentChange = (field: keyof TextBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await regenerateBlock(block.id);
  };

  // Get custom colors or use defaults
  const backgroundColor = block.content.backgroundColor || '#FFFFFF';
  const headingColor = block.content.headingColor || '#111827';
  const textColor = block.content.textColor || '#4B5563';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-10 rounded-bauhaus-md border-l-8 border-bauhaus-yellow shadow-bauhaus-lg"
      style={{ backgroundColor }}
    >
      {/* Geometric corner accents */}
      <div className="absolute top-4 right-4 w-6 h-6 bg-bauhaus-yellow rounded-bauhaus-sm opacity-30"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 bg-bauhaus-blue rounded-full opacity-20"></div>

      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-6 right-6 bg-gray-800 hover:bg-black disabled:bg-gray-300 rounded-bauhaus-md p-3 bauhaus-transition group border-2 border-black shadow-bauhaus-sm z-10"
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
              className="w-5 h-5 text-white group-hover:rotate-12 bauhaus-transition"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
              <line x1="16" y1="8" x2="2" y2="22"/>
              <line x1="17.5" y1="15" x2="9" y2="15"/>
            </svg>
          )}
        </button>
      )}
      <div className="max-w-3xl mx-auto relative">
        <input
          type="text"
          className="w-full bauhaus-h2 font-bold mb-6 border-b-4 border-transparent hover:border-bauhaus-yellow focus:border-bauhaus-yellow focus:outline-none bauhaus-transition"
          style={{ color: headingColor, backgroundColor: 'transparent' }}
          value={block.content.heading}
          onChange={(e) => handleContentChange('heading', e.target.value)}
          placeholder="Text Block Heading"
        />
        <textarea
          className="w-full text-lg leading-relaxed border-2 border-gray-300 hover:border-black focus:border-black focus:outline-none resize-none rounded-bauhaus-sm p-4 bauhaus-transition shadow-bauhaus-sm"
          style={{ color: textColor, backgroundColor }}
          rows={5}
          value={block.content.body}
          onChange={(e) => handleContentChange('body', e.target.value)}
          placeholder="Enter your text content here..."
        />

        {/* Decorative accent */}
        <div className="absolute -bottom-2 right-8 w-16 h-1 bg-gradient-to-r from-bauhaus-yellow to-bauhaus-blue rounded-full"></div>
      </div>
    </motion.div>
  );
}
