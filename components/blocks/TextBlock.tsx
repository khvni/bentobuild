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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-8 bg-white rounded-lg border border-gray-200"
    >
      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg p-2 transition-all"
          title="Generate with AI"
        >
          {isRegenerating ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-600"
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
              className="w-5 h-5 text-gray-600"
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
      <div className="max-w-3xl mx-auto">
        <input
          type="text"
          className="w-full text-3xl font-bold mb-4 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
          value={block.content.heading}
          onChange={(e) => handleContentChange('heading', e.target.value)}
          placeholder="Text Block Heading"
        />
        <textarea
          className="w-full text-lg text-gray-700 border-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none resize-none rounded p-2"
          rows={4}
          value={block.content.body}
          onChange={(e) => handleContentChange('body', e.target.value)}
          placeholder="Enter your text content here..."
        />
      </div>
    </motion.div>
  );
}
