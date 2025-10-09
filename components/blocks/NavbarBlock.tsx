'use client';

import { NavbarBlock as NavbarBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';
import { Menu, X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface NavbarBlockProps {
  block: NavbarBlockType;
}

export default function NavbarBlock({ block }: NavbarBlockProps) {
  const { updateBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isRegenerating = regeneratingBlockId === block.id;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleContentChange = (field: keyof NavbarBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  const handleLinkChange = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...block.content.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateBlock(block.id, {
      content: { ...block.content, links: newLinks },
    });
  };

  const handleAddLink = () => {
    const newLinks = [...block.content.links, { text: 'New Link', url: '#' }];
    updateBlock(block.id, {
      content: { ...block.content, links: newLinks },
    });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = block.content.links.filter((_, i) => i !== index);
    updateBlock(block.id, {
      content: { ...block.content, links: newLinks },
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
      className="relative bg-white border-b-4 border-black shadow-bauhaus-lg"
    >
      {/* Bauhaus accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bauhaus-red via-bauhaus-yellow to-bauhaus-blue"></div>
      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-4 right-4 z-50 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg p-2 transition-all"
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

      <nav className="max-w-6xl mx-auto px-6 py-4">
        {/* Desktop Layout */}
        <div className="flex items-center justify-between">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            {block.content.logoUrl && (
              <img
                src={block.content.logoUrl}
                alt={block.content.brandName}
                className="h-8 w-8 object-contain"
              />
            )}
            <input
              type="text"
              className="bauhaus-h3 font-bold text-black border-b-4 border-transparent hover:border-bauhaus-red focus:border-bauhaus-red focus:outline-none bauhaus-transition uppercase tracking-wide"
              value={block.content.brandName}
              onChange={(e) => handleContentChange('brandName', e.target.value)}
              placeholder="Brand Name"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {block.content.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <input
                  type="text"
                  className="text-gray-700 hover:text-blue-600 border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none font-medium"
                  value={link.text}
                  onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                  placeholder="Link"
                />
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                  title="Remove link"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddLink}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Add link"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200"
          >
            <div className="flex flex-col gap-3">
              {block.content.links.map((link, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <input
                    type="text"
                    className="flex-1 text-gray-700 hover:text-blue-600 border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none font-medium py-2"
                    value={link.text}
                    onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                    placeholder="Link"
                  />
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-all"
                    title="Remove link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddLink}
                className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Link</span>
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Link URL Editor (Below navbar) */}
      <div className="max-w-6xl mx-auto px-6 pb-4 border-t border-gray-100 pt-4 bg-gray-50">
        <p className="text-xs font-semibold text-gray-600 mb-3">Link URLs:</p>
        <div className="grid gap-2">
          {block.content.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 font-medium min-w-[100px]">{link.text}:</span>
              <input
                type="text"
                className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 font-mono text-xs"
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                placeholder="URL"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Logo URL (optional):
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={block.content.logoUrl || ''}
            onChange={(e) => handleContentChange('logoUrl', e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>
    </motion.div>
  );
}
