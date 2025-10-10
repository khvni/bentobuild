'use client';

import { FooterBlock as FooterBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

interface FooterBlockProps {
  block: FooterBlockType;
}

export default function FooterBlock({ block }: FooterBlockProps) {
  const { updateBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isRegenerating = regeneratingBlockId === block.id;

  const handleContentChange = (field: keyof FooterBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...block.content.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateBlock(block.id, {
      content: { ...block.content, socialLinks: newLinks },
    });
  };

  const handleAddSocialLink = () => {
    const newLinks = [...block.content.socialLinks, { platform: 'Social', url: '#' }];
    updateBlock(block.id, {
      content: { ...block.content, socialLinks: newLinks },
    });
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = block.content.socialLinks.filter((_, i) => i !== index);
    updateBlock(block.id, {
      content: { ...block.content, socialLinks: newLinks },
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
      className="relative bg-gray-900 text-white border-t-4 border-bauhaus-yellow shadow-bauhaus-lg"
    >
      {/* Bauhaus accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bauhaus-blue via-bauhaus-yellow to-bauhaus-red"></div>
      {hasContext && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="absolute top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-850 rounded-lg p-2 transition-all"
          title="Generate with AI"
        >
          {isRegenerating ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-300"
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
              className="w-5 h-5 text-gray-300"
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

      <footer className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          {/* Company Info */}
          <div>
            <input
              type="text"
              className="bauhaus-h3 font-bold text-white bg-transparent border-b-4 border-transparent hover:border-bauhaus-yellow focus:border-bauhaus-yellow focus:outline-none bauhaus-transition uppercase tracking-wide mb-3"
              value={block.content.companyName}
              onChange={(e) => handleContentChange('companyName', e.target.value)}
              placeholder="Company Name"
            />
            <div className="text-gray-400 text-sm">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Contact:</label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-transparent hover:border-gray-600 focus:border-bauhaus-blue focus:outline-none text-gray-300 pb-1"
                value={block.content.contactEmail}
                onChange={(e) => handleContentChange('contactEmail', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center justify-center">
            <input
              type="text"
              className="text-center text-gray-400 bg-transparent border-b border-transparent hover:border-gray-600 focus:border-bauhaus-blue focus:outline-none px-2 py-1"
              value={block.content.copyright}
              onChange={(e) => handleContentChange('copyright', e.target.value)}
              placeholder="© 2024 Company. All rights reserved."
            />
          </div>

          {/* Social Links */}
          <div>
            <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Connect</p>
            <div className="space-y-2">
              {block.content.socialLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-b border-transparent hover:border-gray-600 focus:border-bauhaus-blue focus:outline-none text-sm text-gray-300"
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    placeholder="Platform"
                  />
                  <button
                    onClick={() => handleRemoveSocialLink(index)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-900 rounded transition-all"
                    title="Remove link"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddSocialLink}
                className="flex items-center gap-1 text-sm text-bauhaus-yellow hover:text-bauhaus-red transition-colors"
                title="Add social link"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Social Link URLs Editor */}
        <div className="border-t border-gray-800 pt-4 bg-gray-950 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">Social Link URLs:</p>
          <div className="grid gap-2">
            {block.content.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 font-medium min-w-[100px]">{link.platform}:</span>
                <input
                  type="text"
                  className="flex-1 px-3 py-1 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-bauhaus-blue focus:border-transparent text-gray-300 font-mono text-xs"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Bauhaus geometric accent */}
      <div className="absolute bottom-4 left-4 w-8 h-8 bg-bauhaus-red opacity-20 rounded-bauhaus-sm rotate-45" aria-hidden="true"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 bg-bauhaus-blue opacity-20 rounded-full" aria-hidden="true"></div>
    </motion.div>
  );
}
