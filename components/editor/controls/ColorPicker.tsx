'use client';

import React, { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleColorChange = (color: string) => {
    setInputValue(color);
    onChange(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Only update if it's a valid color format
    if (newValue.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => handleColorChange(e.target.value)}
        className="w-12 h-12 rounded-bauhaus-md border-2 border-black cursor-pointer"
      />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="#FFFFFF"
        className="flex-1 px-3 py-2 border-2 border-black rounded-bauhaus-md text-sm font-mono uppercase"
      />
    </div>
  );
}
