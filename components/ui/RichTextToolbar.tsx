'use client';

import { Editor } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import ColorPicker from './ColorPicker';

interface RichTextToolbarProps {
  editor: Editor;
}

const FONT_SIZES = [
  { label: '8px', value: '8px' },
  { label: '10px', value: '10px' },
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
  { label: '48px', value: '48px' },
  { label: '72px', value: '72px' },
];

export default function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const fontSizeRef = useRef<HTMLDivElement>(null);

  // Get current text color
  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  // Get current font size
  const getCurrentFontSize = (): string => {
    const attrs = editor.getAttributes('textStyle');
    return attrs.fontSize || '16px';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target as Node)) {
        setShowFontSizeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
    disabled = false,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-bauhaus-sm bauhaus-transition border-2 focus:outline-none focus:ring-2 focus:ring-bauhaus-blue ${
        isActive
          ? 'bg-bauhaus-blue text-white border-black'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );

  return (
    <div
      className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-2 border-gray-300 rounded-bauhaus-sm shadow-bauhaus-sm mb-2"
      role="toolbar"
      aria-label="Text formatting toolbar"
    >
      {/* Bold */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
          />
        </svg>
      </ToolbarButton>

      {/* Italic */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      </ToolbarButton>

      {/* Underline */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 3v7a6 6 0 0012 0V3m-6 15h6M6 24h12"
          />
        </svg>
      </ToolbarButton>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1" aria-hidden="true" />

      {/* Font Size Dropdown */}
      <div className="relative" ref={fontSizeRef}>
        <button
          type="button"
          onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
          className="px-3 py-2 rounded-bauhaus-sm bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 bauhaus-transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bauhaus-blue flex items-center gap-1"
          title="Font Size"
          aria-label="Font size selector"
          aria-expanded={showFontSizeDropdown}
          aria-haspopup="listbox"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 4h12M6 8h8m-8 4h12m-8 4h8m-8 4h12"
            />
          </svg>
          <span className="font-mono">{getCurrentFontSize()}</span>
          <svg
            className={`w-3 h-3 transition-transform ${showFontSizeDropdown ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showFontSizeDropdown && (
          <div
            className="absolute z-50 mt-1 bg-white border-2 border-black rounded-bauhaus-sm shadow-bauhaus-lg max-h-64 overflow-y-auto"
            role="listbox"
            aria-label="Font size options"
          >
            {FONT_SIZES.map((size) => {
              const isSelected = getCurrentFontSize() === size.value;
              return (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setMark('textStyle', { fontSize: size.value }).run();
                    setShowFontSizeDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left border-b border-gray-200 last:border-b-0 bauhaus-transition ${
                    isSelected
                      ? 'bg-bauhaus-blue text-white font-semibold'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                  style={{ fontSize: size.value }}
                  role="option"
                  aria-selected={isSelected}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Text Color Picker */}
      <div className="relative" ref={colorPickerRef}>
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded-bauhaus-sm bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 bauhaus-transition focus:outline-none focus:ring-2 focus:ring-bauhaus-blue flex items-center gap-1"
          title="Text Color"
          aria-label="Text color picker"
          aria-expanded={showColorPicker}
          aria-haspopup="dialog"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 21h10M12 3v1m0 0v15m0-15l-4 4m4-4l4 4"
            />
          </svg>
          <div
            className="w-4 h-4 rounded border border-gray-400"
            style={{ backgroundColor: currentColor }}
            aria-hidden="true"
          />
        </button>

        {showColorPicker && (
          <div className="absolute z-50 mt-1 left-0">
            <ColorPicker
              label="Text Color"
              value={currentColor}
              onChange={(color) => {
                editor.chain().focus().setColor(color).run();
              }}
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1" aria-hidden="true" />

      {/* Clear Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="Clear Formatting"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </ToolbarButton>
    </div>
  );
}
