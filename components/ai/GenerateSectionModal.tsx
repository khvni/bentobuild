'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { SectionVariant } from '@/types/canvas.types';
import { X, Sparkles, Loader2, Info } from 'lucide-react';

interface GenerateSectionModalProps {
  sectionId: string;
  sectionVariant: SectionVariant;
  onClose: () => void;
}

export default function GenerateSectionModal({
  sectionId,
  sectionVariant,
  onClose,
}: GenerateSectionModalProps) {
  const [specificRequest, setSpecificRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { page, updateSection, contextPrompt } = useBuilderStore();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant: sectionVariant,
          contextPrompt: contextPrompt || page?.metadata?.description || 'A modern website',
          specificRequest: specificRequest.trim(),
        }),
      });

      const data = await response.json();

      if (data.success && data.section) {
        // Update the existing section with the generated components
        updateSection(sectionId, {
          children: data.section.children,
          layout: data.section.layout,
        });
        onClose();
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err) {
      console.error('Section generation error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    const placeholders: Record<SectionVariant, string> = {
      navbar: 'e.g., "Include links to Home, About, Services, and Contact with a Get Started button"',
      hero: 'e.g., "Emphasize fast delivery and premium quality for our design agency"',
      content: 'e.g., "Explain our company history and mission in 2-3 paragraphs"',
      features: 'e.g., "Highlight 3 key benefits: speed, reliability, and support"',
      gallery: 'e.g., "Showcase 6 recent project images from our portfolio"',
      testimonials: 'e.g., "Include 3 customer testimonials about our excellent service"',
      cta: 'e.g., "Encourage visitors to sign up for our free trial"',
      footer: 'e.g., "Include Privacy, Terms, and Contact links with social media icons"',
    };
    return placeholders[sectionVariant];
  };

  const getDescription = () => {
    const descriptions: Record<SectionVariant, string> = {
      navbar: 'A navigation bar with brand name, links, and optional CTA button',
      hero: 'A hero section with bold heading, subheading, and call-to-action button',
      content: 'A content section with heading and 2-3 paragraphs of text',
      features: 'A features grid with 3 items, each with a heading and description',
      gallery: 'An image gallery with 4-6 images and captions',
      testimonials: '2-3 customer testimonials with quotes and attribution',
      cta: 'A call-to-action section with heading, description, and button',
      footer: 'A footer with company info, links, and copyright',
    };
    return descriptions[sectionVariant];
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
            <h2 className="bauhaus-h3 uppercase">Generate {sectionVariant} Section</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-bauhaus-sm transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Description */}
        <div className="bg-blue-50 rounded-bauhaus-md p-3 mb-4 border-2 border-bauhaus-blue">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-bauhaus-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-800">{getDescription()}</p>
          </div>
        </div>

        {/* Global Context Display */}
        {(contextPrompt || page?.metadata?.description) && (
          <div className="bg-gray-100 rounded-bauhaus-md p-3 mb-4 border-2 border-gray-300">
            <p className="text-xs font-bold text-gray-600 uppercase mb-1">Website Context:</p>
            <p className="text-sm text-gray-800">
              {contextPrompt || page?.metadata?.description}
            </p>
          </div>
        )}

        {/* Specific Request Input */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
            Specific Instructions (Optional)
          </label>
          <textarea
            value={specificRequest}
            onChange={(e) => setSpecificRequest(e.target.value)}
            placeholder={getPlaceholder()}
            rows={4}
            className="w-full border-2 border-black rounded-bauhaus-md p-3 text-sm focus:ring-2 focus:ring-bauhaus-blue focus:border-bauhaus-blue transition-all resize-none"
            disabled={isLoading}
            autoFocus
          />
          <p className="text-xs text-gray-600 mt-1">
            Leave blank to use the website context above
          </p>
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
            disabled={isLoading}
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
                Generate Section
              </>
            )}
          </button>
        </div>

        {/* Warning */}
        <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 rounded-bauhaus-md p-2">
          <p className="text-xs text-yellow-800">
            This will replace all components in this section with AI-generated content.
          </p>
        </div>
      </div>
    </div>
  );
}
