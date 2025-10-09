'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { useBlockEditor } from '@/hooks/useBlockEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Block } from '@/types/block.types';

export default function BlockEditorPanel() {
  const { blocks, selectedBlockId, selectBlock, updateBlock, deleteBlock, contextPrompt } = useBuilderStore();
  const { loading, error, success, generateContent, resetStatus } = useBlockEditor();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const handleFieldChange = (field: string, value: string) => {
    if (!selectedBlock) return;
    updateBlock(selectedBlock.id, {
      content: { ...selectedBlock.content, [field]: value },
    });
  };

  const handleGenerateContent = () => {
    if (!selectedBlock) return;
    generateContent(selectedBlock.id, selectedBlock.type, selectedBlock.content);
  };

  const handleDelete = () => {
    if (!selectedBlock) return;
    deleteBlock(selectedBlock.id);
  };

  const renderFields = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={block.content.heading}
                onChange={(e) => handleFieldChange('heading', e.target.value)}
                placeholder="Hero heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={block.content.subheading}
                onChange={(e) => handleFieldChange('subheading', e.target.value)}
                placeholder="Hero subheading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={block.content.ctaText}
                onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                placeholder="Call to action text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={block.content.ctaLink}
                onChange={(e) => handleFieldChange('ctaLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </>
        );

      case 'text':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={block.content.heading}
                onChange={(e) => handleFieldChange('heading', e.target.value)}
                placeholder="Section heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                value={block.content.body}
                onChange={(e) => handleFieldChange('body', e.target.value)}
                placeholder="Enter your text content..."
              />
            </div>
          </>
        );

      case 'image':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={block.content.src}
                onChange={(e) => handleFieldChange('src', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={block.content.alt}
                onChange={(e) => handleFieldChange('alt', e.target.value)}
                placeholder="Image description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={block.content.caption}
                onChange={(e) => handleFieldChange('caption', e.target.value)}
                placeholder="Optional caption"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getBlockTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hero: 'Hero Section',
      text: 'Text Block',
      image: 'Image Block',
    };
    return labels[type] || type;
  };

  const getBlockTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      hero: '🎯',
      text: '📝',
      image: '🖼️',
    };
    return icons[type] || '📦';
  };

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-5xl mb-3">✏️</div>
          <p className="text-sm font-medium">Select a block to edit</p>
          <p className="text-xs mt-1">Click on any block in the canvas</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getBlockTypeIcon(selectedBlock.type)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{getBlockTypeLabel(selectedBlock.type)}</h3>
              <p className="text-xs text-gray-500">{selectedBlock.id}</p>
            </div>
          </div>
          <button
            onClick={() => selectBlock(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border-l-4 border-red-400 p-3 mx-4 mt-4"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={resetStatus}
                className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Fields */}
      <div className="flex-1 p-4 space-y-4 relative">
        <div className={loading ? 'blur-sm pointer-events-none' : ''}>
          {renderFields(selectedBlock)}
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/80"
            >
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-3 text-sm text-gray-600 font-medium">Generating content...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-white/90"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="mt-3 text-sm text-gray-700 font-medium">Content generated!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
        <button
          onClick={handleGenerateContent}
          disabled={loading || !contextPrompt.trim()}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate with AI
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Block
        </button>
        {!contextPrompt.trim() && (
          <p className="text-xs text-gray-500 text-center">
            Add a website context to enable AI generation
          </p>
        )}
      </div>
    </motion.div>
  );
}
