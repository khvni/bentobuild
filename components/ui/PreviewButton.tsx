'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreviewSync } from '@/hooks/usePreviewSync';
import { Eye } from 'lucide-react';

export default function PreviewButton() {
  const { blocks, contextPrompt } = useBuilderStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveSyncEnabled, setLiveSyncEnabled] = useState(false);

  // Live sync hook
  const {
    isSyncing,
    lastSyncTime,
    syncError,
    enableSync,
    disableSync,
    manualSync,
  } = usePreviewSync();

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
        setSandboxId(data.sandboxId || null);
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

    // Disable sync when modal closes
    if (liveSyncEnabled) {
      disableSync();
      setLiveSyncEnabled(false);
    }
  };

  const toggleLiveSync = () => {
    if (!sandboxId || isMock) return;

    if (liveSyncEnabled) {
      disableSync();
      setLiveSyncEnabled(false);
    } else {
      enableSync(sandboxId);
      setLiveSyncEnabled(true);
    }
  };

  const handleManualSync = async () => {
    await manualSync();
  };

  // Format time ago
  const getTimeAgo = (date: Date | null): string => {
    if (!date) return 'Never';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  // Sync status indicator
  const getSyncStatusIcon = () => {
    if (!liveSyncEnabled) return '⚪'; // Gray - disabled
    if (isSyncing) return '🟡'; // Yellow - syncing
    if (syncError) return '🔴'; // Red - error
    return '🟢'; // Green - synced
  };

  return (
    <>
      {/* Preview Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePreview}
        disabled={isLoading}
        className={`fixed bottom-8 right-8 z-50 bauhaus-button px-6 py-3 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 bauhaus-transition shadow-bauhaus-md ${
          isLoading
            ? 'bg-gray-400 border-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white border-black hover:shadow-bauhaus-lg hover:bg-blue-700 active:scale-95'
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
            Preview Site!
          </span>
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

                    {/* Live Sync Controls */}
                    {!isMock && sandboxId && (
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getSyncStatusIcon()}</span>
                            <span className="font-semibold text-gray-900">Live Sync</span>
                          </div>
                          <button
                            onClick={toggleLiveSync}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              liveSyncEnabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                liveSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {liveSyncEnabled && (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between text-gray-600">
                              <span>Status:</span>
                              <span className={`font-medium ${syncError ? 'text-red-600' : isSyncing ? 'text-yellow-600' : 'text-green-600'}`}>
                                {syncError ? 'Error' : isSyncing ? 'Syncing...' : 'Up to date'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                              <span>Last synced:</span>
                              <span className="font-medium text-gray-900">
                                {getTimeAgo(lastSyncTime)}
                              </span>
                            </div>
                            {syncError && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                {syncError}
                              </div>
                            )}
                            <button
                              onClick={handleManualSync}
                              disabled={isSyncing}
                              className="w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isSyncing ? 'Syncing...' : 'Sync Now'}
                            </button>
                          </div>
                        )}

                        {!liveSyncEnabled && (
                          <p className="text-xs text-gray-600 text-center">
                            Enable to sync changes automatically
                          </p>
                        )}
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
