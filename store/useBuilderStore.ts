import { create } from 'zustand';
import { Block, BuilderState } from '@/types/block.types';
import { Page, Section, Component } from '@/types/canvas.types';
import { historyMiddleware } from './middleware/historyMiddleware';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';
import { v4 as uuid } from 'uuid';

// Base state without middleware actions
interface BaseBuilderState {
  blocks: Block[];
  contextPrompt: string;
  selectedBlockId: string | null;
  page: Page | null;
  addBlock: (block: Block) => void;
  addBlocks: (blocks: Block[]) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  setContextPrompt: (prompt: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (blocks: Block[]) => void;
  addSection: (section: Section) => void;
  addSectionWithComponents: (section: Section) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  addComponent: (sectionId: string, component: Component) => void;
  updateComponent: (sectionId: string, componentId: string, updates: Partial<Component>) => void;
  deleteComponent: (sectionId: string, componentId: string) => void;
  setPage: (page: Page) => void;
}

export const useBuilderStore = create<BuilderState>(
  historyMiddleware(
    persistenceMiddleware(
      (set): BaseBuilderState => ({
        blocks: [],
        contextPrompt: '',
        selectedBlockId: null,
        page: null,

        addBlock: (block: Block) =>
          set((state) => ({
            blocks: [...state.blocks, block],
          })),

        addBlocks: (blocks: Block[]) =>
          set({ blocks }),

        updateBlock: (id: string, updates: Partial<Block>) =>
          set((state) => ({
            blocks: state.blocks.map((block) =>
              block.id === id ? { ...block, ...updates } as Block : block
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

        // Page-based architecture actions
        setPage: (page: Page) =>
          set({ page }),

        addSection: (section: Section) =>
          set((state) => {
            const page = state.page || {
              id: uuid(),
              sections: [],
              viewport: { zoom: 1, x: 0, y: 0 },
              metadata: {},
            };
            return {
              page: {
                ...page,
                sections: [...page.sections, section],
              },
            };
          }),

        addSectionWithComponents: (section: Section) =>
          set((state) => {
            const currentPage = state.page || {
              id: uuid(),
              sections: [],
              viewport: { zoom: 1, x: 0, y: 0 },
              metadata: {},
            };

            // Calculate position based on current sections
            const newOrder = currentPage.sections.length;
            section.order = newOrder;
            section.position = { x: 100, y: newOrder * 450 + 100 };

            return {
              page: {
                ...currentPage,
                sections: [...currentPage.sections, section],
              },
            };
          }),

        updateSection: (id: string, updates: Partial<Section>) =>
          set((state) => {
            if (!state.page) return state;
            return {
              page: {
                ...state.page,
                sections: state.page.sections.map((s) =>
                  s.id === id ? { ...s, ...updates } : s
                ),
              },
            };
          }),

        deleteSection: (id: string) =>
          set((state) => {
            if (!state.page) return state;
            return {
              page: {
                ...state.page,
                sections: state.page.sections.filter((s) => s.id !== id),
              },
            };
          }),

        addComponent: (sectionId: string, component: Component) =>
          set((state) => {
            if (!state.page) return state;
            return {
              page: {
                ...state.page,
                sections: state.page.sections.map((s) =>
                  s.id === sectionId
                    ? { ...s, children: [...s.children, component] }
                    : s
                ),
              },
            };
          }),

        updateComponent: (sectionId: string, componentId: string, updates: Partial<Component>) =>
          set((state) => {
            if (!state.page) return state;
            return {
              page: {
                ...state.page,
                sections: state.page.sections.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        children: s.children.map((c) =>
                          c.id === componentId
                            ? {
                                ...c,
                                ...updates,
                                // Deeply merge content if provided in updates
                                content: updates.content
                                  ? { ...c.content, ...updates.content }
                                  : c.content,
                              } as Component
                            : c
                        ),
                      }
                    : s
                ),
              },
            };
          }),

        deleteComponent: (sectionId: string, componentId: string) =>
          set((state) => {
            if (!state.page) return state;
            return {
              page: {
                ...state.page,
                sections: state.page.sections.map((s) =>
                  s.id === sectionId
                    ? { ...s, children: s.children.filter((c) => c.id !== componentId) }
                    : s
                ),
              },
            };
          }),
      }),
      { excludeKeys: ['selectedBlockId'] } // Don't persist selected block
    ),
    { maxHistorySize: 50 }
  )
);
