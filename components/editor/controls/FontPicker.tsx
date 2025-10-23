'use client';

import React from 'react';
import { FontFamily } from '@/types/canvas.types';

interface FontPickerProps {
  value?: FontFamily;
  onChange: (font: FontFamily) => void;
}

const AVAILABLE_FONTS: FontFamily[] = [
  'Inter',
  'Instrument Serif',
  'Noto Sans',
  'Lexend',
  'Manrope',
  'EB Garamond',
  'Playfair Display',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
];

export default function FontPicker({ value = 'Inter', onChange }: FontPickerProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FontFamily)}
      className="w-full px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm font-bold uppercase bg-white"
      style={{ fontFamily: value }}
    >
      {AVAILABLE_FONTS.map((font) => (
        <option key={font} value={font} style={{ fontFamily: font }}>
          {font}
        </option>
      ))}
    </select>
  );
}
