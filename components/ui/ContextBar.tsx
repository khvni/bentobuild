'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { Check, Save, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function ContextBar() {
  const { contextPrompt, setContextPrompt, addBlocks } = useBuilderStore();
  const [isSaved, setIsSaved] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);
  const hasContext = contextPrompt.length > 0;

  const handleSaveContext = () => {
    // Context is automatically saved via persistence middleware
    // Show visual feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleBentoBuild = async () => {
    if (!hasContext || isBuilding) return;

    setIsBuilding(true);
    setBuildError(null);

    try {
      const response = await fetch('/api/bento-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contextPrompt }),
      });

      const data = await response.json();

      if (data.success && data.blocks) {
        addBlocks(data.blocks);
        setIsSaved(false); // Reset saved state since content changed
      } else {
        setBuildError(data.error || 'Failed to generate layout');
        setTimeout(() => setBuildError(null), 5000);
      }
    } catch (error) {
      console.error('Bento Build error:', error);
      setBuildError('Network error. Please try again.');
      setTimeout(() => setBuildError(null), 5000);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="w-full border-b-2 border-gray-300 bg-white shadow-bauhaus-sm relative">
      {/* Bauhaus geometric accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bauhaus-red via-bauhaus-yellow to-bauhaus-blue"></div>

      <div className="max-w-7xl mx-auto px-6 py-5 relative">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-bauhaus-red rounded-bauhaus-sm opacity-30"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-bauhaus-blue rounded-full opacity-20"></div>

        <div className="flex items-start gap-6">
          <div className="flex-1">
            <label
              htmlFor="context"
              className="block text-sm font-bold text-black mb-3 uppercase tracking-wider flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-bauhaus-yellow rounded-full"></span>
              Website Context {hasContext && <Check className="w-4 h-4 text-green-600" />}
            </label>
            <textarea
              id="context"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-bauhaus-md focus:ring-0 focus:border-black resize-none bg-white text-gray-900 placeholder-gray-500 bauhaus-transition shadow-bauhaus-sm"
              placeholder="Describe your website (e.g., 'I'm a freelance photographer specializing in landscape and portrait photography')"
              value={contextPrompt}
              onChange={(e) => setContextPrompt(e.target.value)}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                This context powers AI content generation for all blocks.
              </p>
              {buildError && (
                <p className="text-xs text-red-600 font-bold animate-pulse">
                  {buildError}
                </p>
              )}
            </div>
          </div>
          <div className="pt-9 flex gap-3">
            <button
              onClick={handleBentoBuild}
              disabled={!hasContext || isBuilding}
              className={`bauhaus-button px-6 py-3 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 bauhaus-transition ${
                hasContext && !isBuilding
                  ? 'bg-blue-600 text-white border-black shadow-bauhaus-md hover:shadow-bauhaus-lg hover:bg-blue-700 active:scale-95'
                  : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
              }`}
              title="Generate complete website layout with AI"
            >
              {isBuilding ? (
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
                  Building...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Bento Build
                </span>
              )}
            </button>
            <button
              onClick={handleSaveContext}
              disabled={!hasContext}
              className={`bauhaus-button px-6 py-3 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 ${
                hasContext
                  ? isSaved
                    ? 'bg-green-600 text-white border-black shadow-bauhaus-md'
                    : 'bg-bauhaus-yellow text-black border-black shadow-bauhaus-md hover:shadow-bauhaus-lg'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed transform-none'
              }`}
            >
              {isSaved ? (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Saved!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
