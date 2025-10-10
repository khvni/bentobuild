'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { useBlockEditor } from '@/hooks/useBlockEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Block, FontFamily } from '@/types/block.types';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
import RichTextEditor from './RichTextEditor';
import { useState } from 'react';

export default function BlockEditorPanel() {
  const { blocks, selectedBlockId, selectBlock, updateBlock, deleteBlock, contextPrompt } = useBuilderStore();
  const { loading, error, success, generateContent, resetStatus } = useBlockEditor();
  const [colorsExpanded, setColorsExpanded] = useState(true);
  const [typographyExpanded, setTypographyExpanded] = useState(true);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const handleFieldChange = (field: string, value: string) => {
    if (!selectedBlock) return;

    // Create properly typed content update based on block type
    switch (selectedBlock.type) {
      case 'hero':
        updateBlock(selectedBlock.id, {
          content: { ...selectedBlock.content, [field]: value },
        });
        break;
      case 'text':
        updateBlock(selectedBlock.id, {
          content: { ...selectedBlock.content, [field]: value },
        });
        break;
      case 'image':
        updateBlock(selectedBlock.id, {
          content: { ...selectedBlock.content, [field]: value },
        });
        break;
      case 'button':
        updateBlock(selectedBlock.id, {
          content: { ...selectedBlock.content, [field]: value },
        });
        break;
      case 'link':
        updateBlock(selectedBlock.id, {
          content: { ...selectedBlock.content, [field]: value },
        });
        break;
      case 'navbar':
        updateBlock(selectedBlock.id, {
          content: { ...selectedBlock.content, [field]: value },
        });
        break;
      case 'footer':
        updateBlock(selectedBlock.id, {
          content: { ...selectedBlock.content, [field]: value },
        });
        break;
    }
  };

  const handleGenerateContent = () => {
    if (!selectedBlock) return;
    generateContent(selectedBlock.id, selectedBlock.type, selectedBlock.content as Record<string, unknown>);
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
            <RichTextEditor
              value={block.content.heading}
              onChange={(html) => handleFieldChange('heading', html)}
              placeholder="Hero heading"
              label="Heading"
              minHeight="100px"
              autoFocus
            />
            <RichTextEditor
              value={block.content.subheading}
              onChange={(html) => handleFieldChange('subheading', html)}
              placeholder="Hero subheading"
              label="Subheading"
              minHeight="80px"
            />
            <div>
              <label htmlFor="hero-cta-text" className="block text-sm font-medium text-gray-700 mb-1">
                CTA Text
              </label>
              <input
                id="hero-cta-text"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.ctaText}
                onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                placeholder="Call to action text"
              />
            </div>
            <div>
              <label htmlFor="hero-cta-link" className="block text-sm font-medium text-gray-700 mb-1">
                CTA Link
              </label>
              <input
                id="hero-cta-link"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.ctaLink}
                onChange={(e) => handleFieldChange('ctaLink', e.target.value)}
                placeholder="https://..."
                aria-describedby="cta-link-help"
              />
              <p id="cta-link-help" className="sr-only">Enter the URL for the call to action button</p>
            </div>

            {/* Typography Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTypographyExpanded(!typographyExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Typography</span>
                <svg
                  className={`w-4 h-4 transition-transform ${typographyExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {typographyExpanded && (
                <div className="space-y-3">
                  <FontSelector
                    value={block.content.fontFamily}
                    onChange={(font: FontFamily) => handleFieldChange('fontFamily', font)}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Font Size
                    </label>
                    <select
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-bauhaus-sm focus:ring-2 focus:ring-bauhaus-blue focus:border-bauhaus-blue focus:outline-none"
                      value={block.content.fontSize || 'medium'}
                      onChange={(e) => handleFieldChange('fontSize', e.target.value)}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setColorsExpanded(!colorsExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Colors</span>
                <svg
                  className={`w-4 h-4 transition-transform ${colorsExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {colorsExpanded && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Background"
                    value={block.content.backgroundColor || '#3B82F6'}
                    onChange={(color) => handleFieldChange('backgroundColor', color)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={block.content.textColor || '#FFFFFF'}
                    onChange={(color) => handleFieldChange('textColor', color)}
                  />
                  <ColorPicker
                    label="Button Background"
                    value={block.content.buttonColor || '#FFFFFF'}
                    onChange={(color) => handleFieldChange('buttonColor', color)}
                  />
                  <ColorPicker
                    label="Button Text"
                    value={block.content.buttonTextColor || '#3B82F6'}
                    onChange={(color) => handleFieldChange('buttonTextColor', color)}
                  />
                </div>
              )}
            </div>
          </>
        );

      case 'text':
        return (
          <>
            <RichTextEditor
              value={block.content.heading}
              onChange={(html) => handleFieldChange('heading', html)}
              placeholder="Section heading"
              label="Heading"
              minHeight="80px"
              autoFocus
            />
            <RichTextEditor
              value={block.content.body}
              onChange={(html) => handleFieldChange('body', html)}
              placeholder="Enter your text content..."
              label="Body"
              minHeight="200px"
            />

            {/* Typography Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTypographyExpanded(!typographyExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Typography</span>
                <svg
                  className={`w-4 h-4 transition-transform ${typographyExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {typographyExpanded && (
                <div className="space-y-3">
                  <FontSelector
                    value={block.content.fontFamily}
                    onChange={(font: FontFamily) => handleFieldChange('fontFamily', font)}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Font Size
                    </label>
                    <select
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-bauhaus-sm focus:ring-2 focus:ring-bauhaus-blue focus:border-bauhaus-blue focus:outline-none"
                      value={block.content.fontSize || 'medium'}
                      onChange={(e) => handleFieldChange('fontSize', e.target.value)}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setColorsExpanded(!colorsExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Colors</span>
                <svg
                  className={`w-4 h-4 transition-transform ${colorsExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {colorsExpanded && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Background"
                    value={block.content.backgroundColor || '#FFFFFF'}
                    onChange={(color) => handleFieldChange('backgroundColor', color)}
                  />
                  <ColorPicker
                    label="Heading Color"
                    value={block.content.headingColor || '#111827'}
                    onChange={(color) => handleFieldChange('headingColor', color)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={block.content.textColor || '#4B5563'}
                    onChange={(color) => handleFieldChange('textColor', color)}
                  />
                </div>
              )}
            </div>
          </>
        );

      case 'image':
        return (
          <>
            <div>
              <label htmlFor="image-src" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                id="image-src"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.src}
                onChange={(e) => handleFieldChange('src', e.target.value)}
                placeholder="https://..."
                aria-required="true"
                aria-describedby="image-src-help"
              />
              <p id="image-src-help" className="sr-only">Enter the URL of the image to display</p>
            </div>
            <div>
              <label htmlFor="image-alt" className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                id="image-alt"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.alt}
                onChange={(e) => handleFieldChange('alt', e.target.value)}
                placeholder="Image description"
                aria-required="true"
                aria-describedby="image-alt-help"
              />
              <p id="image-alt-help" className="text-xs text-gray-600 mt-1">
                Describe the image for screen readers (required for accessibility)
              </p>
            </div>
              <RichTextEditor
              value={block.content.caption}
              onChange={(html) => handleFieldChange('caption', html)}
              placeholder="Optional caption"
              label="Caption"
              minHeight="60px"
            />

            {/* Typography Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTypographyExpanded(!typographyExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Typography</span>
                <svg
                  className={`w-4 h-4 transition-transform ${typographyExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {typographyExpanded && (
                <div className="space-y-3">
                  <FontSelector
                    value={block.content.fontFamily}
                    onChange={(font: FontFamily) => handleFieldChange('fontFamily', font)}
                  />
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setColorsExpanded(!colorsExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Colors</span>
                <svg
                  className={`w-4 h-4 transition-transform ${colorsExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {colorsExpanded && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Background"
                    value={block.content.backgroundColor || '#F9FAFB'}
                    onChange={(color) => handleFieldChange('backgroundColor', color)}
                  />
                  <ColorPicker
                    label="Caption Color"
                    value={block.content.captionColor || '#4B5563'}
                    onChange={(color) => handleFieldChange('captionColor', color)}
                  />
                </div>
              )}
            </div>
          </>
        );

      case 'button':
        return (
          <>
            <div>
              <label htmlFor="button-text" className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                id="button-text"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.text}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                placeholder="Button text"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="button-url" className="block text-sm font-medium text-gray-700 mb-1">
                Button URL
              </label>
              <input
                id="button-url"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.url}
                onChange={(e) => handleFieldChange('url', e.target.value)}
                placeholder="https://..."
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="button-style" className="block text-sm font-medium text-gray-700 mb-1">
                Button Style
              </label>
              <select
                id="button-style"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.style}
                onChange={(e) => handleFieldChange('style', e.target.value as 'filled' | 'outlined' | 'text')}
              >
                <option value="filled">Filled</option>
                <option value="outlined">Outlined</option>
                <option value="text">Text</option>
              </select>
            </div>

            {/* Typography Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTypographyExpanded(!typographyExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Typography</span>
                <svg
                  className={`w-4 h-4 transition-transform ${typographyExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {typographyExpanded && (
                <div className="space-y-3">
                  <FontSelector
                    value={block.content.fontFamily}
                    onChange={(font: FontFamily) => handleFieldChange('fontFamily', font)}
                  />
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setColorsExpanded(!colorsExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Colors</span>
                <svg
                  className={`w-4 h-4 transition-transform ${colorsExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {colorsExpanded && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Background Color"
                    value={block.content.backgroundColor || '#3B82F6'}
                    onChange={(color) => handleFieldChange('backgroundColor', color)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={block.content.textColor || '#FFFFFF'}
                    onChange={(color) => handleFieldChange('textColor', color)}
                  />
                  {block.content.style === 'outlined' && (
                    <ColorPicker
                      label="Border Color"
                      value={block.content.borderColor || '#3B82F6'}
                      onChange={(color) => handleFieldChange('borderColor', color)}
                    />
                  )}
                </div>
              )}
            </div>
          </>
        );

      case 'link':
        return (
          <>
            <div>
              <label htmlFor="link-text" className="block text-sm font-medium text-gray-700 mb-1">
                Link Text
              </label>
              <input
                id="link-text"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.text}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                placeholder="Link text"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-1">
                Link URL
              </label>
              <input
                id="link-url"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.url}
                onChange={(e) => handleFieldChange('url', e.target.value)}
                placeholder="https://..."
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="link-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="link-description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none focus:outline-none"
                value={block.content.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Link description (optional)"
              />
            </div>

            {/* Typography Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTypographyExpanded(!typographyExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Typography</span>
                <svg
                  className={`w-4 h-4 transition-transform ${typographyExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {typographyExpanded && (
                <div className="space-y-3">
                  <FontSelector
                    value={block.content.fontFamily}
                    onChange={(font: FontFamily) => handleFieldChange('fontFamily', font)}
                  />
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setColorsExpanded(!colorsExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Colors</span>
                <svg
                  className={`w-4 h-4 transition-transform ${colorsExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {colorsExpanded && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Background Color"
                    value={block.content.backgroundColor || '#FFFFFF'}
                    onChange={(color) => handleFieldChange('backgroundColor', color)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={block.content.textColor || '#111827'}
                    onChange={(color) => handleFieldChange('textColor', color)}
                  />
                  <ColorPicker
                    label="Link Color"
                    value={block.content.linkColor || '#3B82F6'}
                    onChange={(color) => handleFieldChange('linkColor', color)}
                  />
                </div>
              )}
            </div>
          </>
        );

      case 'navbar':
        return (
          <>
            <div>
              <label htmlFor="navbar-brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name
              </label>
              <input
                id="navbar-brand"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.brandName}
                onChange={(e) => handleFieldChange('brandName', e.target.value)}
                placeholder="Brand name"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="navbar-logo" className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                id="navbar-logo"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.logoUrl || ''}
                onChange={(e) => handleFieldChange('logoUrl', e.target.value)}
                placeholder="https://... (optional)"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Navigation Links
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Edit links directly in the navbar block on the canvas
              </p>
            </div>

            {/* Typography Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTypographyExpanded(!typographyExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Typography</span>
                <svg
                  className={`w-4 h-4 transition-transform ${typographyExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {typographyExpanded && (
                <div className="space-y-3">
                  <FontSelector
                    value={block.content.fontFamily}
                    onChange={(font: FontFamily) => handleFieldChange('fontFamily', font)}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Font Size
                    </label>
                    <select
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-bauhaus-sm focus:ring-2 focus:ring-bauhaus-blue focus:border-bauhaus-blue focus:outline-none"
                      value={block.content.fontSize || 'medium'}
                      onChange={(e) => handleFieldChange('fontSize', e.target.value)}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setColorsExpanded(!colorsExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Colors</span>
                <svg
                  className={`w-4 h-4 transition-transform ${colorsExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {colorsExpanded && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Background Color"
                    value={block.content.backgroundColor || '#FFFFFF'}
                    onChange={(color) => handleFieldChange('backgroundColor', color)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={block.content.textColor || '#111827'}
                    onChange={(color) => handleFieldChange('textColor', color)}
                  />
                  <ColorPicker
                    label="Link Color"
                    value={block.content.linkColor || '#3B82F6'}
                    onChange={(color) => handleFieldChange('linkColor', color)}
                  />
                  <ColorPicker
                    label="Link Hover Color"
                    value={block.content.linkHoverColor || '#2563EB'}
                    onChange={(color) => handleFieldChange('linkHoverColor', color)}
                  />
                </div>
              )}
            </div>
          </>
        );

      case 'footer':
        return (
          <>
            <div>
              <label htmlFor="footer-company" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                id="footer-company"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.companyName}
                onChange={(e) => handleFieldChange('companyName', e.target.value)}
                placeholder="Company name"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="footer-copyright" className="block text-sm font-medium text-gray-700 mb-1">
                Copyright Text
              </label>
              <input
                id="footer-copyright"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.copyright}
                onChange={(e) => handleFieldChange('copyright', e.target.value)}
                placeholder="© 2024 Company"
              />
            </div>
            <div>
              <label htmlFor="footer-email" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                id="footer-email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                value={block.content.contactEmail}
                onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Social Links
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Edit social links directly in the footer block on the canvas
              </p>
            </div>

            {/* Typography Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTypographyExpanded(!typographyExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Typography</span>
                <svg
                  className={`w-4 h-4 transition-transform ${typographyExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {typographyExpanded && (
                <div className="space-y-3">
                  <FontSelector
                    value={block.content.fontFamily}
                    onChange={(font: FontFamily) => handleFieldChange('fontFamily', font)}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Font Size
                    </label>
                    <select
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-bauhaus-sm focus:ring-2 focus:ring-bauhaus-blue focus:border-bauhaus-blue focus:outline-none"
                      value={block.content.fontSize || 'medium'}
                      onChange={(e) => handleFieldChange('fontSize', e.target.value)}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setColorsExpanded(!colorsExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
              >
                <span>Colors</span>
                <svg
                  className={`w-4 h-4 transition-transform ${colorsExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {colorsExpanded && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Background Color"
                    value={block.content.backgroundColor || '#111827'}
                    onChange={(color) => handleFieldChange('backgroundColor', color)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={block.content.textColor || '#F9FAFB'}
                    onChange={(color) => handleFieldChange('textColor', color)}
                  />
                  <ColorPicker
                    label="Link Color"
                    value={block.content.linkColor || '#60A5FA'}
                    onChange={(color) => handleFieldChange('linkColor', color)}
                  />
                </div>
              )}
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
      button: 'Button Block',
      link: 'Link Block',
      navbar: 'Navbar Block',
      footer: 'Footer Block',
    };
    return labels[type] || type;
  };

  const getBlockTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      hero: '🎯',
      text: '📝',
      image: '🖼️',
      button: '🔘',
      link: '🔗',
      navbar: '📍',
      footer: '🦶',
    };
    return icons[type] || '📦';
  };

  if (!selectedBlock) {
    return (
      <aside
        className="w-80 bg-gray-50 border-l-4 border-black p-6 flex items-center justify-center relative"
        role="complementary"
        aria-label="Block editor panel"
      >
        {/* Geometric decorations */}
        <div className="absolute top-8 right-8 w-8 h-8 bg-bauhaus-blue rounded-full opacity-20" aria-hidden="true"></div>
        <div className="absolute bottom-16 left-6 w-12 h-12 bg-bauhaus-yellow rounded-bauhaus-sm opacity-20" aria-hidden="true"></div>

        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-bauhaus-md flex items-center justify-center shadow-bauhaus-md border-2 border-gray-300">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p className="bauhaus-h3 text-gray-900 mb-2">Editor</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select a block to edit</p>
        </div>
      </aside>
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 bg-gray-50 border-l-4 border-black overflow-y-auto flex flex-col"
      role="complementary"
      aria-label="Block editor panel"
    >
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-300 flex-shrink-0 bg-white relative">
        {/* Colored accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bauhaus-red via-bauhaus-yellow to-bauhaus-blue" aria-hidden="true"></div>

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-bauhaus-sm flex items-center justify-center border-2 border-gray-300">
              <span className="text-2xl">{getBlockTypeIcon(selectedBlock.type)}</span>
            </div>
            <div>
              <h3 className="bauhaus-h3 text-black uppercase">{getBlockTypeLabel(selectedBlock.type)}</h3>
              <p className="text-xs text-gray-500 font-mono">{selectedBlock.id.split('-')[0]}</p>
            </div>
          </div>
          <button
            onClick={() => selectBlock(null)}
            className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-bauhaus-sm focus:outline-none focus:ring-2 focus:ring-bauhaus-blue"
            aria-label="Close editor panel"
            title="Close (Escape)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
        <div
          className={loading ? 'blur-sm pointer-events-none' : ''}
          role="form"
          aria-label={`Edit ${getBlockTypeLabel(selectedBlock.type)}`}
        >
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
      <div
        className="p-6 border-t-2 border-gray-300 space-y-3 flex-shrink-0 bg-white"
        role="group"
        aria-label="Block actions"
      >
        <button
          onClick={handleGenerateContent}
          disabled={loading || !contextPrompt.trim()}
          className="bauhaus-button w-full bg-bauhaus-blue text-white rounded-bauhaus-md font-bold shadow-bauhaus-md hover:shadow-bauhaus-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-bauhaus-blue focus:ring-offset-2"
          aria-label="Generate content with AI"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate AI
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bauhaus-button w-full bg-white text-bauhaus-red border-2 border-bauhaus-red rounded-bauhaus-md font-bold hover:bg-bauhaus-red hover:text-white shadow-bauhaus-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-bauhaus-red focus:ring-offset-2"
          aria-label={`Delete ${getBlockTypeLabel(selectedBlock.type)}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
        {!contextPrompt.trim() && (
          <p
            className="text-xs text-gray-600 text-center font-semibold uppercase tracking-wide mt-3"
            role="status"
            aria-live="polite"
          >
            Add context to enable AI
          </p>
        )}
      </div>
    </motion.aside>
  );
}
