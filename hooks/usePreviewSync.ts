import { useEffect, useRef, useState, useCallback } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Block } from '@/types/block.types';

interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
}

interface UsePreviewSyncReturn extends SyncStatus {
  enableSync: (sandboxId: string) => void;
  disableSync: () => void;
  manualSync: () => Promise<void>;
}

// Debounce timings based on change type
const DEBOUNCE_DELAY = 2500; // 2.5 seconds default
const MAX_WAIT_TIME = 10000; // Force sync after 10 seconds max
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Hook for syncing Bentoblocks builder state to Daytona preview
 *
 * Features:
 * - Subscribes to Zustand store changes
 * - Debounces updates to avoid excessive API calls
 * - Tracks sandbox ID and sync status
 * - Handles errors gracefully with retry logic
 * - Provides manual sync trigger
 */
export function usePreviewSync(): UsePreviewSyncReturn {
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const maxWaitTimer = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const lastBlocksRef = useRef<Block[] | null>(null);
  const consecutiveErrorsRef = useRef(0);

  /**
   * Deep equality check for blocks to avoid unnecessary syncs
   */
  const blocksEqual = (a: Block[], b: Block[]): boolean => {
    if (a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  };

  /**
   * Perform the actual sync operation with retry logic
   */
  const performSync = useCallback(
    async (blocks: Block[], contextPrompt: string, retryCount = 0): Promise<boolean> => {
      if (!sandboxId) return false;

      // Check if blocks actually changed
      if (lastBlocksRef.current && blocksEqual(blocks, lastBlocksRef.current)) {
        console.log('📭 No changes detected, skipping sync');
        return true;
      }

      // Cancel any in-flight request
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();
      setIsSyncing(true);
      setSyncError(null);

      try {
        const response = await fetch('/api/update-preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sandboxId,
            blocks,
            contextPrompt,
          }),
          signal: abortController.current.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle specific error cases
          if (data.sandboxGone) {
            setSyncError('Preview closed - please create a new preview');
            setSandboxId(null); // Disable sync
            return false;
          }

          if (response.status === 429 && retryCount < RETRY_ATTEMPTS) {
            // Rate limited - wait and retry
            console.log(`⏳ Rate limited, retrying in ${RETRY_DELAY}ms...`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            return performSync(blocks, contextPrompt, retryCount + 1);
          }

          throw new Error(data.error || 'Sync failed');
        }

        // Success
        lastBlocksRef.current = blocks;
        setLastSyncTime(new Date(data.timestamp));
        consecutiveErrorsRef.current = 0;
        console.log('✅ Preview synced successfully at', data.timestamp);
        return true;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('🚫 Sync cancelled');
          return false;
        }

        const errorMessage = error instanceof Error ? error.message : 'Sync failed';
        console.error('❌ Sync error:', errorMessage);

        consecutiveErrorsRef.current++;

        // Retry logic with exponential backoff
        if (retryCount < RETRY_ATTEMPTS) {
          const delay = RETRY_DELAY * Math.pow(2, retryCount);
          console.log(`🔄 Retrying in ${delay}ms... (attempt ${retryCount + 1}/${RETRY_ATTEMPTS})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return performSync(blocks, contextPrompt, retryCount + 1);
        }

        // Max retries exceeded
        setSyncError(errorMessage);

        // Disable sync after too many consecutive errors
        if (consecutiveErrorsRef.current >= 5) {
          console.error('❌ Too many sync errors, disabling auto-sync');
          setSandboxId(null);
        }

        return false;
      } finally {
        setIsSyncing(false);
      }
    },
    [sandboxId]
  );

  /**
   * Debounced sync function
   */
  const debouncedSync = useCallback(
    (blocks: Block[], contextPrompt: string) => {
      // Clear existing timers
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set up new debounce timer
      debounceTimer.current = setTimeout(() => {
        performSync(blocks, contextPrompt);
        if (maxWaitTimer.current) {
          clearTimeout(maxWaitTimer.current);
          maxWaitTimer.current = null;
        }
      }, DEBOUNCE_DELAY);

      // Set up max wait timer if not already set
      if (!maxWaitTimer.current) {
        maxWaitTimer.current = setTimeout(() => {
          if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
          }
          performSync(blocks, contextPrompt);
          maxWaitTimer.current = null;
        }, MAX_WAIT_TIME);
      }
    },
    [performSync]
  );

  /**
   * Subscribe to store changes
   */
  useEffect(() => {
    if (!sandboxId) return;

    let prevBlocks: Block[] | null = null;
    let prevContextPrompt: string | null = null;

    const unsubscribe = useBuilderStore.subscribe((state) => {
      const currentBlocks = state.blocks;
      const currentContextPrompt = state.contextPrompt;

      // Check if anything changed
      const blocksChanged = !prevBlocks || !blocksEqual(prevBlocks, currentBlocks);
      const contextChanged = prevContextPrompt !== currentContextPrompt;

      if (blocksChanged || contextChanged) {
        debouncedSync(currentBlocks, currentContextPrompt);
        prevBlocks = currentBlocks;
        prevContextPrompt = currentContextPrompt;
      }
    });

    return () => {
      unsubscribe();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (maxWaitTimer.current) {
        clearTimeout(maxWaitTimer.current);
      }
    };
  }, [sandboxId, debouncedSync]);

  /**
   * Enable sync for a sandbox
   */
  const enableSync = useCallback((newSandboxId: string) => {
    console.log('🔄 Enabling live sync for sandbox:', newSandboxId);
    setSandboxId(newSandboxId);
    setSyncError(null);
    consecutiveErrorsRef.current = 0;
    lastBlocksRef.current = null;
  }, []);

  /**
   * Disable sync
   */
  const disableSync = useCallback(() => {
    console.log('⏸️ Disabling live sync');
    setSandboxId(null);
    setLastSyncTime(null);
    setSyncError(null);
    lastBlocksRef.current = null;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    if (maxWaitTimer.current) {
      clearTimeout(maxWaitTimer.current);
      maxWaitTimer.current = null;
    }
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  /**
   * Manually trigger sync immediately
   */
  const manualSync = useCallback(async () => {
    if (!sandboxId) {
      setSyncError('No preview active');
      return;
    }

    const state = useBuilderStore.getState();
    await performSync(state.blocks, state.contextPrompt);
  }, [sandboxId, performSync]);

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    enableSync,
    disableSync,
    manualSync,
  };
}
