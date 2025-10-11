'use client';

import { TextBlock as TextBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';
import { getFontClassName } from '@/components/ui/FontSelector';
import { validateHtmlContent } from '@/lib/sanitizeHtml';
import TiptapEditor from '@/components/ui/TiptapEditor';

interface TextBlockProps {
  block: TextBlockType;
}

export default function TextBlock({ block }: TextBlockProps) {
  const { selectedBlockId, updateBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isSelected = selectedBlockId === block.id;
  const isRegenerating = regeneratingBlockId === block.id;

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await regenerateBlock(block.id);
  };

  const handleContentChange = (field: keyof TextBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  // Get custom colors or use defaults
  const backgroundColor = block.content.backgroundColor || '#FFFFFF';
  const headingColor = block.content.headingColor || '#111827';
  const textColor = block.content.textColor || '#4B5563';

  // Get typography settings
  const fontClass = block.content.fontFamily ? getFontClassName(block.content.fontFamily) : '';
  const getFontSize = (size?: string) => {
    switch (size) {
      case 'small': return { heading: 'text-2xl', body: 'text-base' };
      case 'large': return { heading: 'text-5xl', body: 'text-xl' };
      case 'xlarge': return { heading: 'text-6xl', body: 'text-2xl' };
      default: return { heading: 'text-3xl', body: 'text-lg' };
    }
  };
  const fontSize = getFontSize(block.content.fontSize);

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
      <div className={`max-w-3xl mx-auto relative ${fontClass}`}>
        {/* Heading - WYSIWYG: Same styled container for edit and display */}
        <div
          className={`${fontSize.heading} font-bold mb-6`}
          style={{ color: headingColor }}
        >
          {isSelected ? (
            <TiptapEditor
              value={block.content.heading}
              onChange={(html) => handleContentChange('heading', html)}
              placeholder="Heading..."
              autoFocus
            />
          ) : (
            <div
              className="tiptap"
              dangerouslySetInnerHTML={{ __html: validateHtmlContent(block.content.heading) }}
            />
          )}
        </div>

        {/* Body - WYSIWYG: Same styled container for edit and display */}
        <div
          className={`${fontSize.body} leading-relaxed`}
          style={{ color: textColor }}
        >
          {isSelected ? (
            <TiptapEditor
              value={block.content.body}
              onChange={(html) => handleContentChange('body', html)}
              placeholder="Body text..."
            />
          ) : (
            <div
              className="tiptap"
              dangerouslySetInnerHTML={{ __html: validateHtmlContent(block.content.body) }}
            />
          )}
        </div>

        {/* Decorative accent */}
        <div className="absolute -bottom-2 right-8 w-16 h-1 bg-gradient-to-r from-bauhaus-yellow to-bauhaus-blue rounded-full"></div>
      </div>
    </motion.div>
  );
}
