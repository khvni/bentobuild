'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Component, ComponentType } from '@/types/canvas.types';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface GenerateModalProps {
  component: Component;
  sectionId: string;
  onClose: () => void;
}

export default function GenerateModal({ component, sectionId, onClose }: GenerateModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { page, updateComponent } = useBuilderStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentType: component.type,
          contextPrompt: page?.metadata?.description || '',
          blockPrompt: prompt,
          existingContent: component.content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateComponent(sectionId, component.id, {
          content: data.content,
        } as Partial<Component>);
        onClose();
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    const placeholders: Record<ComponentType, string> = {
      heading: 'e.g., "Main headline about our services"',
      text: 'e.g., "Paragraph explaining our company values"',
      button: 'e.g., "Call to action for free trial signup"',
      image: 'e.g., "Hero image showing our product in action"',
      link: 'e.g., "Link to our detailed case study"',
      spacer: 'e.g., "40px vertical spacing"',
      divider: 'e.g., "Subtle section separator"',
    };
    return placeholders[component.type];
  };

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-bauhaus-lg border-4 border-black shadow-bauhaus-lg max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-bauhaus-yellow" />
            <h2 className="bauhaus-h3 uppercase">Generate {component.type}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-bauhaus-sm transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Context Display */}
        {page?.metadata?.description && (
          <div className="bg-gray-100 rounded-bauhaus-md p-3 mb-4 border-2 border-gray-300">
            <p className="text-xs font-bold text-gray-600 uppercase mb-1">Website Context:</p>
            <p className="text-sm text-gray-800">{page.metadata.description}</p>
          </div>
        )}

        {/* Prompt Input */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
            What should this {component.type} be about?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            rows={4}
            className="w-full border-2 border-black rounded-bauhaus-md p-3 text-sm focus:ring-2 focus:ring-bauhaus-blue focus:border-bauhaus-blue transition-all resize-none"
            disabled={isLoading}
            autoFocus
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-500 rounded-bauhaus-md p-3 mb-4">
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold uppercase text-sm rounded-bauhaus-md border-2 border-black transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="flex-1 px-4 py-2 bg-bauhaus-yellow hover:bg-yellow-400 text-black font-bold uppercase text-sm rounded-bauhaus-md border-2 border-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
