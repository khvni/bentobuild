'use client';

import React, { useRef, useCallback } from 'react';

interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

/**
 * RichTextInput - A simple text input with keyboard shortcut support for markdown-style formatting
 *
 * Supported shortcuts:
 * - Cmd/Ctrl+B: Wrap selection with **bold**
 * - Cmd/Ctrl+I: Wrap selection with *italic*
 * - Cmd/Ctrl+U: Wrap selection with __underline__
 *
 * Note: This is a simplified version that uses plain text with markdown-style markers.
 * For now, blocks will store plain text. Full rich text rendering can be added later.
 */
export default function RichTextInput({
  value,
  onChange,
  placeholder = '',
  className = '',
  multiline = false,
}: RichTextInputProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (!isMod) return;

      const target = e.currentTarget;
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? 0;
      const selectedText = value.substring(start, end);

      if (!selectedText) return; // No selection

      let wrapper = '';
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          wrapper = '**';
          break;
        case 'i':
          e.preventDefault();
          wrapper = '*';
          break;
        case 'u':
          e.preventDefault();
          wrapper = '__';
          break;
        default:
          return;
      }

      // Wrap the selected text
      const newValue =
        value.substring(0, start) + wrapper + selectedText + wrapper + value.substring(end);
      onChange(newValue);

      // Restore selection after React re-render
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(start + wrapper.length, end + wrapper.length);
        }
      }, 0);
    },
    [value, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  if (multiline) {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
    />
  );
}
