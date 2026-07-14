import { create } from 'zustand';
import { Block, BuilderState } from '@/types/block.types';
import { historyMiddleware } from './middleware/historyMiddleware';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';

// Base state without middleware actions
interface BaseBuilderState {
  blocks: Block[];
  contextPrompt: string;
  selectedBlockId: string | null;
  addBlock: (block: Block) => void;
  addBlocks: (blocks: Block[]) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  setContextPrompt: (prompt: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (blocks: Block[]) => void;
}

export const useBuilderStore = create<BuilderState>(
  historyMiddleware(
    persistenceMiddleware(
      (set): BaseBuilderState => ({
        blocks: [],
        contextPrompt: '',
        selectedBlockId: null,

        addBlock: (block: Block) =>
          set((state) => ({
            blocks: [...state.blocks, block],
          })),

        addBlocks: (blocks: Block[]) => set({ blocks }),

        updateBlock: (id: string, updates: Partial<Block>) =>
          set((state) => ({
            blocks: state.blocks.map((block) =>
              block.id === id ? ({ ...block, ...updates } as Block) : block
            ),
          })),

        deleteBlock: (id: string) =>
          set((state) => ({
            blocks: state.blocks.filter((block) => block.id !== id),
            selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
          })),

        setContextPrompt: (prompt: string) => set({ contextPrompt: prompt }),

        selectBlock: (id: string | null) => set({ selectedBlockId: id }),

        reorderBlocks: (blocks: Block[]) => set({ blocks }),
      }),
      { excludeKeys: ['selectedBlockId'] } // Don't persist selected block
    ),
    { maxHistorySize: 50 }
  )
);
