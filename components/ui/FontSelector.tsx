'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { FontFamily } from '@/types/block.types';
import { Type } from 'lucide-react';

export default function FontSelector() {
  const { selectedFont, setFont } = useBuilderStore();

  const fontOptions: { value: FontFamily; label: string; description: string }[] = [
    { value: 'sans', label: 'Sans Serif', description: 'Noto Sans - Modern & Clean' },
    { value: 'serif', label: 'Serif', description: 'Instrument Serif - Classic & Elegant' },
  ];

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value as FontFamily);
  };

  return (
    <div className="flex items-center gap-2">
      <Type className="w-5 h-5 text-gray-600" />
      <select
        value={selectedFont}
        onChange={handleFontChange}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors"
        aria-label="Select font family"
      >
        {fontOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
