'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { useState } from 'react';
import { Block } from '@/types/block.types';

export function useContextPrompt() {
  const { contextPrompt, setContextPrompt, blocks, updateBlock } = useBuilderStore();
  const [regeneratingBlockId, setRegeneratingBlockId] = useState<string | null>(null);

  const regenerateBlock = async (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !contextPrompt) return;

    setRegeneratingBlockId(blockId);
    try {
      const response = await fetch('/api/generate-block-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: block.type,
          contextPrompt,
          existingFields: block.content,
        }),
      });

      const data = await response.json();
      if (data.success) {
        updateBlock(blockId, { content: data.content });
      }
    } catch (error) {
      console.error('Failed to regenerate block:', error);
    } finally {
      setRegeneratingBlockId(null);
    }
  };

  return {
    contextPrompt,
    setContextPrompt,
    regenerateBlock,
    regeneratingBlockId,
    hasContext: contextPrompt.length > 0,
    hasBlocks: blocks.length > 0,
  };
}
