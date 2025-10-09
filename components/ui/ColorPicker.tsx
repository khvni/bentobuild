'use client';

import { useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  showAlpha?: boolean;
}

const PRESET_COLORS = {
  primary: [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Yellow', value: '#EAB308' },
    { name: 'Green', value: '#10B981' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Cyan', value: '#06B6D4' },
  ],
  neutrals: [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Gray 50', value: '#F9FAFB' },
    { name: 'Gray 100', value: '#F3F4F6' },
    { name: 'Gray 200', value: '#E5E7EB' },
    { name: 'Gray 300', value: '#D1D5DB' },
    { name: 'Gray 400', value: '#9CA3AF' },
    { name: 'Gray 500', value: '#6B7280' },
    { name: 'Gray 600', value: '#4B5563' },
    { name: 'Gray 700', value: '#374151' },
    { name: 'Gray 800', value: '#1F2937' },
    { name: 'Gray 900', value: '#111827' },
    { name: 'Black', value: '#000000' },
  ],
};

export default function ColorPicker({
  label,
  value,
  onChange,
  showAlpha = false,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#3B82F6');

  const handlePresetClick = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative">
      <label
        id={`color-picker-label-${label.replace(/\s+/g, '-').toLowerCase()}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="flex gap-2">
        {/* Color Preview Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-bauhaus-blue"
          aria-labelledby={`color-picker-label-${label.replace(/\s+/g, '-').toLowerCase()}`}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: value || '#FFFFFF' }}
          />
          <span className="text-sm font-mono">{value || 'None'}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Custom Color Input */}
        <input
          type="color"
          value={customColor}
          onChange={handleCustomChange}
          className="w-12 h-10 rounded border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-bauhaus-blue"
          title="Pick custom color"
          aria-label={`Custom color picker for ${label}`}
        />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Color Palette */}
          <div
            className="absolute z-20 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-xs"
            role="dialog"
            aria-label={`Color picker for ${label}`}
          >
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2" id="primary-colors-heading">
                Primary Colors
              </h4>
              <div className="grid grid-cols-5 gap-2" role="group" aria-labelledby="primary-colors-heading">
                {PRESET_COLORS.primary.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handlePresetClick(color.value)}
                    className={`w-10 h-10 rounded border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-bauhaus-blue ${
                      value === color.value
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    aria-label={`${color.name} - ${color.value}`}
                    aria-pressed={value === color.value}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2" id="neutrals-heading">
                Neutrals
              </h4>
              <div className="grid grid-cols-6 gap-2" role="group" aria-labelledby="neutrals-heading">
                {PRESET_COLORS.neutrals.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handlePresetClick(color.value)}
                    className={`w-10 h-10 rounded border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-bauhaus-blue ${
                      value === color.value
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    aria-label={`${color.name} - ${color.value}`}
                    aria-pressed={value === color.value}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <label htmlFor={`custom-hex-${label.replace(/\s+/g, '-').toLowerCase()}`} className="block text-xs font-semibold text-gray-700 mb-2">
                Custom Color (Hex)
              </label>
              <input
                id={`custom-hex-${label.replace(/\s+/g, '-').toLowerCase()}`}
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    onChange(e.target.value);
                  }
                }}
                placeholder="#3B82F6"
                className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                aria-describedby={`custom-hex-help-${label.replace(/\s+/g, '-').toLowerCase()}`}
              />
              <p id={`custom-hex-help-${label.replace(/\s+/g, '-').toLowerCase()}`} className="sr-only">
                Enter a hex color code like #3B82F6
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
