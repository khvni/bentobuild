'use client';

import { ImageBlock as ImageBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { motion } from 'framer-motion';

interface ImageBlockProps {
  block: ImageBlockType;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  const { updateBlock, selectedBlockId, selectBlock } = useBuilderStore();
  const isSelected = selectedBlockId === block.id;

  const handleContentChange = (field: keyof ImageBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 bg-white rounded-lg cursor-pointer transition-all ${
        isSelected ? 'ring-4 ring-yellow-400' : 'hover:shadow-md border border-gray-200'
      }`}
      onClick={() => selectBlock(block.id)}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <input
            type="text"
            className="w-full text-sm mb-2 px-3 py-2 border-2 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none rounded"
            value={block.content.src}
            onChange={(e) => handleContentChange('src', e.target.value)}
            placeholder="Image URL"
            onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => e.stopPropagation()}
        />
        <input
          type="text"
          className="w-full text-sm px-3 py-2 border-2 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none rounded"
          value={block.content.caption}
          onChange={(e) => handleContentChange('caption', e.target.value)}
          placeholder="Caption (optional)"
          onClick={(e) => e.stopPropagation()}
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
