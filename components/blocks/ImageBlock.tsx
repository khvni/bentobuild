'use client';

import { ImageBlock as ImageBlockType } from '@/types/block.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useContextPrompt } from '@/hooks/useContextPrompt';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getFontClassName } from '@/components/ui/FontSelector';
import { validateHtmlContent } from '@/lib/sanitizeHtml';
import TiptapEditor from '@/components/ui/TiptapEditor';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { useState } from 'react';

type UploadMode = 'url' | 'upload';

interface ImageBlockProps {
  block: ImageBlockType;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  const { selectedBlockId, updateBlock } = useBuilderStore();
  const { regenerateBlock, regeneratingBlockId, hasContext } = useContextPrompt();
  const isSelected = selectedBlockId === block.id;
  const isRegenerating = regeneratingBlockId === block.id;

  // Track mode: URL input or file upload
  const [mode, setMode] = useState<UploadMode>('url');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const handleContentChange = (field: keyof ImageBlockType['content'], value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value },
    });
  };

  const handleFileDrop = (files: FileWithPath[]) => {
    setUploadError('');
    const file = files[0];
    if (!file) return;

    // Convert file to base64 data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      handleContentChange('src', dataUrl);
      setUploadedFileName(file.name);
    };
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileReject = () => {
    setUploadError('Invalid file type or size. Please upload an image under 5MB.');
  };

  const clearUploadedFile = () => {
    handleContentChange('src', '');
    setUploadedFileName('');
    setUploadError('');
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await regenerateBlock(block.id);
  };

  // Get custom colors or use defaults
  const backgroundColor = block.content.backgroundColor || '#F9FAFB';
  const captionColor = block.content.captionColor || '#4B5563';

  // Get typography settings
  const fontClass = block.content.fontFamily ? getFontClassName(block.content.fontFamily) : '';

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
          {/* Mode Toggle Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode('url');
                setUploadError('');
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-bauhaus-sm border-2 bauhaus-transition ${
                mode === 'url'
                  ? 'bg-black text-white border-black shadow-bauhaus-sm'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              URL
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode('upload');
                setUploadError('');
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-bauhaus-sm border-2 bauhaus-transition ${
                mode === 'upload'
                  ? 'bg-black text-white border-black shadow-bauhaus-sm'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              Upload
            </button>
          </div>

          {/* URL Input Mode */}
          {mode === 'url' && (
            <input
              type="text"
              className="w-full text-sm mb-4 px-4 py-3 border-2 border-gray-400 hover:border-black focus:border-black focus:outline-none rounded-bauhaus-sm bauhaus-transition shadow-bauhaus-sm font-mono"
              value={block.content.src}
              onChange={(e) => handleContentChange('src', e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Image URL (https://...)"
            />
          )}

          {/* Upload Mode - Dropzone */}
          {mode === 'upload' && !block.content.src && (
            <Dropzone
              onDrop={handleFileDrop}
              onReject={handleFileReject}
              maxSize={5 * 1024 * 1024} // 5MB
              accept={IMAGE_MIME_TYPE}
              className="mb-4"
              style={{
                border: '4px dashed #9CA3AF',
                borderRadius: '4px',
                backgroundColor: '#F9FAFB',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              styles={{
                root: {
                  ':hover': {
                    borderColor: '#000000',
                    backgroundColor: '#F3F4F6',
                  },
                },
              }}
            >
              <div
                className="flex flex-col items-center justify-center py-12"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  className="w-16 h-16 mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Drag image here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Accepts PNG, JPEG, GIF, WebP (max 5MB)
                </p>
              </div>
            </Dropzone>
          )}

          {/* Show uploaded file info in upload mode */}
          {mode === 'upload' && block.content.src && uploadedFileName && (
            <div className="mb-4 p-3 bg-green-50 border-2 border-green-400 rounded-bauhaus-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-semibold text-green-800">
                  {uploadedFileName}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearUploadedFile();
                }}
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-bauhaus-sm bauhaus-transition border-2 border-red-800"
              >
                Remove
              </button>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-400 rounded-bauhaus-sm">
              <p className="text-sm font-semibold text-red-800">{uploadError}</p>
            </div>
          )}

          {/* Image Preview - Same for both modes */}
          {block.content.src ? (
            <div className="relative">
              <Image
                src={block.content.src}
                alt={block.content.alt || 'Block image'}
                width={800}
                height={320}
                className="w-full h-80 object-cover rounded-bauhaus-md border-4 border-black shadow-bauhaus-lg"
                unoptimized
              />
              {/* Image corner accent */}
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-bauhaus-blue rounded-bauhaus-sm opacity-80 -z-10"></div>
            </div>
          ) : mode === 'url' ? (
            <div className="w-full h-80 bg-gray-200 rounded-bauhaus-md border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500">
              <svg className="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="font-bold uppercase text-xs tracking-wider">No Image URL</p>
            </div>
          ) : null}
        </div>
        <div className="space-y-3">
          <input
            type="text"
            className="w-full text-sm px-4 py-2 border-2 border-gray-300 hover:border-gray-400 focus:border-black focus:outline-none rounded-bauhaus-sm bauhaus-transition"
            value={block.content.alt}
            onChange={(e) => handleContentChange('alt', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Alt text (accessibility)"
          />
        </div>
        {/* Caption - WYSIWYG: Same styled container for edit and display */}
        {(isSelected || block.content.caption) && (
          <div
            className={`mt-4 text-center text-sm font-semibold ${fontClass}`}
            style={{ color: captionColor }}
          >
            {isSelected ? (
              <TiptapEditor
                value={block.content.caption || ''}
                onChange={(html) => handleContentChange('caption', html)}
                placeholder="Image caption (optional)..."
              />
            ) : (
              block.content.caption && (
                <div
                  className="tiptap"
                  dangerouslySetInnerHTML={{ __html: validateHtmlContent(block.content.caption) }}
                />
              )
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
