'use client';

import { FontFamily } from '@/types/block.types';
import { useState, useRef, useEffect } from 'react';
import { fontMap } from '@/lib/fonts';

interface FontSelectorProps {
  value?: FontFamily;
  onChange: (font: FontFamily) => void;
  label?: string;
}

const FONT_OPTIONS: { name: FontFamily; category: string }[] = [
  { name: 'Inter', category: 'Sans-serif, Modern' },
  { name: 'Noto Sans', category: 'Sans-serif, Universal' },
  { name: 'Lexend', category: 'Sans-serif, Readable' },
  { name: 'Manrope', category: 'Sans-serif, Geometric' },
  { name: 'Instrument Serif', category: 'Serif, Editorial' },
  { name: 'EB Garamond', category: 'Serif, Classic' },
  { name: 'Playfair Display', category: 'Serif, Elegant' },
];

export const getFontClassName = (font: FontFamily): string => {
  const fontObject = fontMap[font];
  return fontObject?.className || fontMap['Inter'].className;
};

export default function FontSelector({
  value,
  onChange,
  label = 'Font Family',
}: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentFont = value || 'Inter';
  const currentFontClass = getFontClassName(currentFont);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (font: FontFamily) => {
    onChange(font);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
        {label}
      </label>

      {/* Selected font display button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-bauhaus-sm hover:border-bauhaus-blue focus:border-bauhaus-blue focus:outline-none transition-colors text-left flex items-center justify-between"
      >
        <span className={`${currentFontClass} font-medium text-gray-900`}>{currentFont}</span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-black rounded-bauhaus-sm shadow-bauhaus-lg max-h-80 overflow-y-auto">
          {FONT_OPTIONS.map((font) => {
            const isSelected = font.name === currentFont;
            const fontClassName = getFontClassName(font.name);
            return (
              <button
                key={font.name}
                type="button"
                onClick={() => handleSelect(font.name)}
                className={`w-full px-4 py-3 text-left border-b border-gray-200 last:border-b-0 transition-colors ${
                  isSelected ? 'bg-bauhaus-blue text-white' : 'hover:bg-gray-100 text-gray-900'
                }`}
              >
                <div className={`${fontClassName} text-base font-semibold mb-1`}>{font.name}</div>
                <div
                  className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-500'} font-sans`}
                >
                  {font.category}
                </div>
                <div
                  className={`${fontClassName} text-sm mt-1 ${isSelected ? 'text-white/80' : 'text-gray-600'}`}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
