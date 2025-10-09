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

  // Get custom colors or use defaults
  const backgroundColor = block.content.backgroundColor || '#F9FAFB';
  const captionColor = block.content.captionColor || '#4B5563';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-10 rounded-bauhaus-md border-l-8 border-bauhaus-blue shadow-bauhaus-lg"
      style={{ backgroundColor }}
    >
      {/* Geometric decorations */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-bauhaus-blue rounded-full opacity-25"></div>
      <div className="absolute bottom-4 left-4 w-10 h-10 bg-bauhaus-yellow rounded-bauhaus-sm opacity-20"></div>

      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-6 right-6 bg-gray-800 hover:bg-black disabled:bg-gray-300 rounded-bauhaus-md p-3 bauhaus-transition border-2 border-black shadow-bauhaus-sm z-20 group"
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
        <div className="mb-6">
          <input
            type="text"
            className="w-full text-sm mb-4 px-4 py-3 border-2 border-gray-400 hover:border-black focus:border-black focus:outline-none rounded-bauhaus-sm bauhaus-transition shadow-bauhaus-sm font-mono"
            value={block.content.src}
            onChange={(e) => handleContentChange('src', e.target.value)}
            placeholder="Image URL (https://...)"
          />
          {block.content.src ? (
            <div className="relative">
              <img
                src={block.content.src}
                alt={block.content.alt || 'Block image'}
                className="w-full h-80 object-cover rounded-bauhaus-md border-4 border-black shadow-bauhaus-lg"
              />
              {/* Image corner accent */}
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-bauhaus-blue rounded-bauhaus-sm opacity-80 -z-10"></div>
            </div>
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-bauhaus-md border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500">
              <svg className="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-bold uppercase text-xs tracking-wider">No Image URL</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <input
            type="text"
            className="w-full text-sm px-4 py-2 border-2 border-gray-300 hover:border-gray-400 focus:border-black focus:outline-none rounded-bauhaus-sm bauhaus-transition"
            value={block.content.alt}
            onChange={(e) => handleContentChange('alt', e.target.value)}
            placeholder="Alt text (accessibility)"
          />
          <input
            type="text"
            className="w-full text-sm px-4 py-2 border-2 border-gray-300 hover:border-gray-400 focus:border-black focus:outline-none rounded-bauhaus-sm bauhaus-transition"
            value={block.content.caption}
            onChange={(e) => handleContentChange('caption', e.target.value)}
            placeholder="Caption (optional)"
          />
        </div>
        {block.content.caption && (
          <p className="mt-4 text-center text-sm font-semibold" style={{ color: captionColor }}>
            {block.content.caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}
