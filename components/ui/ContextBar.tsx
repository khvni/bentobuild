'use client';

import { useContextPrompt } from '@/hooks/useContextPrompt';

export default function ContextBar() {
  const {
    contextPrompt,
    setContextPrompt,
    regenerateAllBlocks,
    isRegenerating,
    hasContext,
    hasBlocks,
  } = useContextPrompt();

  const canRegenerate = hasContext && hasBlocks && !isRegenerating;

  return (
    <div
      className={`w-full border-b shadow-sm transition-all ${
        hasContext
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <label
              htmlFor="context"
              className={`block text-sm font-medium mb-2 transition-colors ${
                hasContext ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              Website Context {hasContext && '✨'}
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
          <div className="pt-7">
            <button
              onClick={regenerateAllBlocks}
              disabled={!canRegenerate}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                canRegenerate
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isRegenerating ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
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
                  Regenerating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Regenerate All
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
