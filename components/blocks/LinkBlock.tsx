'use client';

import { LinkBlock as LinkBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface LinkBlockProps {
  block: LinkBlockType;
}

export default function LinkBlock({ block }: LinkBlockProps) {
  const { updateBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isRegenerating = regeneratingBlockId === block.id;

  const handleContentChange = (field: keyof LinkBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await regenerateBlock(block.id);
  };

  const backgroundColor = block.content.backgroundColor || '#FFFFFF';
  const textColor = block.content.textColor || '#111827';
  const linkColor = block.content.linkColor || '#3B82F6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-10 border-l-8 border-bauhaus-yellow rounded-bauhaus-md shadow-bauhaus-lg hover:shadow-bauhaus-xl bauhaus-transition"
      style={{ backgroundColor }}
    >
      {/* Geometric accents */}
      <div className="absolute top-4 right-4 w-6 h-6 bg-bauhaus-yellow rounded-full opacity-25"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 bg-bauhaus-blue rounded-bauhaus-sm opacity-20"></div>

      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-6 right-6 bg-gray-800 hover:bg-black disabled:bg-gray-300 rounded-bauhaus-md p-3 bauhaus-transition border-2 border-black shadow-bauhaus-sm z-10"
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

      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-3 group">
          <ExternalLink className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1 group-hover:text-blue-700 transition-colors" />

          <div className="flex-1">
            <input
              type="text"
              className="w-full bauhaus-h3 font-bold border-b-4 border-transparent hover:border-current focus:border-current focus:outline-none mb-4 bauhaus-transition uppercase tracking-wide"
              style={{ color: linkColor }}
              value={block.content.text}
              onChange={(e) => handleContentChange('text', e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Link Text"
            />

            <textarea
              className="w-full border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300 focus:outline-none mb-3 resize-none"
              style={{ color: textColor, backgroundColor }}
              value={block.content.description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Link description (optional)"
              rows={2}
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">URL:</span>
              <input
                type="text"
                className="flex-1 text-sm text-gray-600 hover:text-gray-800 border-b border-transparent hover:border-gray-400 focus:border-gray-400 focus:outline-none font-mono"
                value={block.content.url}
                onChange={(e) => handleContentChange('url', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
