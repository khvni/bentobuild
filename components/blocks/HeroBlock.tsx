'use client';

import { HeroBlock as HeroBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';

interface HeroBlockProps {
  block: HeroBlockType;
}

export default function HeroBlock({ block }: HeroBlockProps) {
  const { updateBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
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

  // Get custom colors or use defaults
  const backgroundColor = block.content.backgroundColor || '#3B82F6';
  const textColor = block.content.textColor || '#FFFFFF';
  const buttonColor = block.content.buttonColor || '#FFFFFF';
  const buttonTextColor = block.content.buttonTextColor || '#3B82F6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-12 rounded-bauhaus-lg border-4 border-black shadow-bauhaus-xl overflow-hidden"
      style={{ backgroundColor, color: textColor }}
    >
      {/* Bauhaus geometric decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-bauhaus-sm"></div>
      <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/10 rounded-full"></div>
      <div className="absolute top-1/2 left-8 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-white/15"></div>

      {/* Color accent bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-bauhaus-red via-bauhaus-yellow to-bauhaus-blue opacity-80"></div>

      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-6 right-6 bg-white/25 hover:bg-white/40 disabled:bg-white/10 backdrop-blur-sm rounded-bauhaus-md p-3 bauhaus-transition group border-2 border-white/50 shadow-bauhaus-sm z-20"
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
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <input
          type="text"
          className="w-full bg-transparent bauhaus-h1 font-bold mb-6 border-b-4 border-transparent hover:border-current focus:border-current focus:outline-none text-center bauhaus-transition"
          style={{ color: textColor }}
          value={block.content.heading}
          onChange={(e) => handleContentChange('heading', e.target.value)}
          placeholder="Hero Heading"
        />
        <input
          type="text"
          className="w-full bg-transparent text-2xl font-semibold mb-10 border-b-2 border-transparent hover:border-current focus:border-current focus:outline-none text-center bauhaus-transition"
          style={{ color: textColor }}
          value={block.content.subheading}
          onChange={(e) => handleContentChange('subheading', e.target.value)}
          placeholder="Hero Subheading"
        />
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <input
            type="text"
            className="bauhaus-button px-8 py-4 border-4 rounded-bauhaus-md bauhaus-transition text-center font-bold uppercase tracking-wide text-lg shadow-bauhaus-md"
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor,
              borderColor: buttonTextColor,
            }}
            value={block.content.ctaText}
            onChange={(e) => handleContentChange('ctaText', e.target.value)}
            placeholder="CTA Text"
          />
          <input
            type="text"
            className="bg-transparent text-sm px-4 py-2 border-2 rounded-bauhaus-sm text-center font-mono"
            style={{ color: textColor, borderColor: textColor, opacity: 0.8 }}
            value={block.content.ctaLink}
            onChange={(e) => handleContentChange('ctaLink', e.target.value)}
            placeholder="URL"
          />
        </div>
      </div>
    </motion.div>
  );
}
