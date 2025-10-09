'use client';

import { ImageBlock as ImageBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';

interface ImageBlockProps {
  block: ImageBlockType;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  const { updateBlock, selectedBlockId, selectBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isSelected = selectedBlockId === block.id;
  const isRegenerating = regeneratingBlockId === block.id;

  const handleContentChange = (field: keyof ImageBlockType['content'], value: string) => {
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
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg p-2 transition-all z-10"
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
        <div className="mb-4">
          <input
            type="text"
            className="w-full text-sm mb-2 px-3 py-2 border-2 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none rounded"
            value={block.content.src}
            onChange={(e) => handleContentChange('src', e.target.value)}
            placeholder="Image URL"
          />
          {block.content.src ? (
            <img
              src={block.content.src}
              alt={block.content.alt || 'Block image'}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              No image URL provided
            </div>
          )}
        </div>
        <input
          type="text"
          className="w-full text-sm mb-2 px-3 py-2 border-2 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none rounded"
          value={block.content.alt}
          onChange={(e) => handleContentChange('alt', e.target.value)}
          placeholder="Alt text"
        />
        <input
          type="text"
          className="w-full text-sm px-3 py-2 border-2 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none rounded"
          value={block.content.caption}
          onChange={(e) => handleContentChange('caption', e.target.value)}
          placeholder="Caption (optional)"
        />
        {block.content.caption && (
          <p className="mt-2 text-center text-sm text-gray-600 italic">
            {block.content.caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}
