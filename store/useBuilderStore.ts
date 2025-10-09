import { create } from 'zustand';
import { Block, BuilderState } from '@/types/block.types';

export const useBuilderStore = create<BuilderState>((set) => ({
  blocks: [],
  contextPrompt: '',
  selectedBlockId: null,

  addBlock: (block: Block) =>
    set((state) => ({
      blocks: [...state.blocks, block],
    })),

  updateBlock: (id: string, updates: Partial<Block>) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    })),

  deleteBlock: (id: string) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
      selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
    })),

  setContextPrompt: (prompt: string) =>
    set({ contextPrompt: prompt }),

  selectBlock: (id: string | null) =>
    set({ selectedBlockId: id }),

  reorderBlocks: (blocks: Block[]) =>
    set({ blocks }),
}));
