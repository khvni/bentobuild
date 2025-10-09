'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreviewButton() {
  const { blocks, contextPrompt } = useBuilderStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async () => {
    if (blocks.length === 0) {
      setError('Add some blocks to your canvas first');
      setShowModal(true);
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

      if (data.success) {
        setPreviewUrl(data.url);
        setIsMock(data.isMock || false);
        setShowModal(true);
      } else {
        setError(data.error || 'Failed to create preview');
        setShowModal(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPreviewUrl(null);
    setError(null);
    setIsMock(false);
  };

  return (
    <>
      {/* Preview Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePreview}
        disabled={isLoading}
        className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
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
          '🚀 Preview Site'
        )}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {error ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Failed</h2>
                    <p className="text-gray-600">{error}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Ready!</h2>
                    {isMock && (
                      <p className="text-sm text-yellow-600 mb-2">
                        ⚠️ Mock mode - Configure DAYTONA_API_KEY for live deployment
                      </p>
                    )}
                    <p className="text-gray-600 mb-4">Your site is now live and ready to view</p>
                    {previewUrl && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-xs text-gray-500 mb-1">Preview URL:</p>
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 break-all font-mono"
                        >
                          {previewUrl}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <a
                      href={previewUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Open Preview
                    </a>
                    <button
                      onClick={() => {
                        if (previewUrl) {
                          navigator.clipboard.writeText(previewUrl);
                        }
                      }}
                      className="w-full px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={closeModal}
                      className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
