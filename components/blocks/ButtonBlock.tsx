'use client';

import { ButtonBlock as ButtonBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';

interface ButtonBlockProps {
  block: ButtonBlockType;
}

export default function ButtonBlock({ block }: ButtonBlockProps) {
  const { updateBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isRegenerating = regeneratingBlockId === block.id;

  const handleContentChange = (field: keyof ButtonBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  const handleStyleChange = (style: 'filled' | 'outlined' | 'text') => {
    updateBlock(block.id, {
      content: { ...block.content, style },
    });
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await regenerateBlock(block.id);
  };

  const getButtonStyles = () => {
    const baseStyles =
      'bauhaus-button px-8 py-4 rounded-bauhaus-md font-bold uppercase tracking-wide text-center border-4 shadow-bauhaus-md hover:shadow-bauhaus-lg';
    const backgroundColor = block.content.backgroundColor || '#3B82F6';
    const textColor = block.content.textColor || '#FFFFFF';
    const borderColor = block.content.borderColor || backgroundColor;

    const style: React.CSSProperties = {};

    switch (block.content.style) {
      case 'filled':
        style.backgroundColor = backgroundColor;
        style.color = textColor;
        style.borderColor = '#000000';
        return { className: baseStyles, style };
      case 'outlined':
        style.borderWidth = '4px';
        style.borderColor = borderColor;
        style.color = borderColor;
        style.backgroundColor = 'transparent';
        return { className: baseStyles, style };
      case 'text':
        style.color = textColor;
        style.backgroundColor = 'transparent';
        style.borderColor = 'transparent';
        style.borderWidth = '4px';
        return { className: `${baseStyles} shadow-none hover:shadow-none`, style };
      default:
        return { className: baseStyles, style: {} };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-10 bg-white rounded-bauhaus-md border-l-8 border-bauhaus-red shadow-bauhaus-lg"
    >
      {/* Geometric decorations */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-bauhaus-red rounded-bauhaus-sm opacity-20"></div>
      <div className="absolute bottom-6 left-6 w-10 h-10 bg-bauhaus-blue rounded-full opacity-15"></div>

      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-6 right-6 bg-gray-800 hover:bg-black disabled:bg-gray-300 rounded-bauhaus-md p-3 bauhaus-transition border-2 border-black shadow-bauhaus-sm z-10"
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
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </button>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-2 bg-gray-100 rounded-bauhaus-md border-2 border-gray-300">
            {(['filled', 'outlined', 'text'] as const).map((style) => (
              <button
                key={style}
                onClick={() => handleStyleChange(style)}
                className={`px-6 py-2 rounded-bauhaus-sm text-xs font-bold uppercase tracking-wider bauhaus-transition ${
                  block.content.style === style
                    ? 'bg-black text-white shadow-bauhaus-sm'
                    : 'text-gray-700 hover:text-black hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {(() => {
            const buttonStyles = getButtonStyles();
            return (
              <div className={buttonStyles.className} style={buttonStyles.style}>
                <input
                  type="text"
                  className="w-full bg-transparent text-center outline-none min-w-[120px]"
                  value={block.content.text}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Button Text"
                />
              </div>
            );
          })()}

          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={block.content.url}
              onChange={(e) => handleContentChange('url', e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="https://example.com"
            />
          </div>

          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                className="w-full h-10 rounded border border-gray-300"
                value={block.content.backgroundColor || '#3B82F6'}
                onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <input
                type="color"
                className="w-full h-10 rounded border border-gray-300"
                value={block.content.textColor || '#FFFFFF'}
                onChange={(e) => handleContentChange('textColor', e.target.value)}
              />
            </div>
            {block.content.style === 'outlined' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
                <input
                  type="color"
                  className="w-full h-10 rounded border border-gray-300"
                  value={block.content.borderColor || '#3B82F6'}
                  onChange={(e) => handleContentChange('borderColor', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
