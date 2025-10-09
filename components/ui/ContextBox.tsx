'use client';

import { useBuilderStore } from '@/store/useBuilderStore';

export default function ContextBox() {
  const { contextPrompt, setContextPrompt } = useBuilderStore();

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
          Website Context
        </label>
        <textarea
          id="context"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Describe your website (e.g., 'I'm a freelance photographer specializing in landscape and portrait photography')"
          value={contextPrompt}
          onChange={(e) => setContextPrompt(e.target.value)}
        />
        <p className="mt-1 text-xs text-gray-500">
          This context will be used to generate relevant content for your blocks.
        </p>
      </div>
    </div>
  );
}
