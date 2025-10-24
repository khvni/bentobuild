import { useCallback } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Block } from '@/types/block.types';

export function useBlockActions() {
  const { deleteBlock, addBlock, selectBlock, selectedBlockId, blocks } = useBuilderStore();

  const handleDelete = useCallback(
    (id: string) => {
      deleteBlock(id);
    },
    [deleteBlock]
  );

  const handleDuplicate = useCallback(
    (block: Block) => {
      const newBlock = {
        ...block,
        id: `${block.type}-${Date.now()}`,
        order: blocks.length,
      };
      addBlock(newBlock);
    },
    [addBlock, blocks.length]
  );

  const handleSelect = useCallback(
    (id: string) => {
      selectBlock(id);
    },
    [selectBlock]
  );

  const isSelected = useCallback(
    (id: string) => {
      return selectedBlockId === id;
    },
    [selectedBlockId]
  );

  return {
    handleDelete,
    handleDuplicate,
    handleSelect,
    isSelected,
  };
}
