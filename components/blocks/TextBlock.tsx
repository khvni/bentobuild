'use client';

import { TextBlock as TextBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { motion } from 'framer-motion';

interface TextBlockProps {
  block: TextBlockType;
}

export default function TextBlock({ block }: TextBlockProps) {
  const { updateBlock } = useBuilderStore();

  const handleContentChange = (field: keyof TextBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-8 bg-white rounded-lg border border-gray-200"
    >
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
