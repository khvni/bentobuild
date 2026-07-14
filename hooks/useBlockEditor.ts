'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { BlockType } from '@/types/block.types';

interface UseBlockEditorReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  generateContent: (
    blockId: string,
    blockType: BlockType,
    existingContent: Record<string, unknown>
  ) => Promise<void>;
  resetStatus: () => void;
}

export function useBlockEditor(): UseBlockEditorReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { contextPrompt, updateBlock } = useBuilderStore();

  const generateContent = async (
    blockId: string,
    blockType: BlockType,
    existingContent: Record<string, unknown>
  ) => {
    if (!contextPrompt.trim()) {
      setError('Please enter a context prompt first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/generate-block-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockType,
          contextPrompt,
          existingFields: existingContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();

      if (data.success && data.content) {
        // Update the block with new content
        updateBlock(blockId, {
          content: data.content,
        });
        setSuccess(true);

        // Auto-dismiss success state after 2 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    generateContent,
    resetStatus,
  };
}
