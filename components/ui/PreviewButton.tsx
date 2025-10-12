'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Eye } from 'lucide-react';

export default function PreviewButton() {
  const { blocks, contextPrompt } = useBuilderStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async () => {
    if (blocks.length === 0) {
      alert('Add some blocks to your canvas first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocks,
          contextPrompt,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Automatically open the preview URL in a new tab
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        alert(data.error || 'Failed to create preview');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePreview}
      disabled={isLoading}
      className={`fixed bottom-8 left-8 z-50 bauhaus-button px-6 py-3 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 bauhaus-transition ${
        isLoading
          ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
          : 'bg-blue-600 text-white border-black shadow-bauhaus-md hover:shadow-bauhaus-lg hover:bg-blue-700 active:scale-95'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
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
          Creating Preview...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Preview Site
        </span>
      )}
    </button>
  );
}
