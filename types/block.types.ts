export type BlockType = 'hero' | 'text' | 'image';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  content: {
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
  };
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: {
    heading: string;
    body: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
    caption: string;
  };
}

export type Block = HeroBlock | TextBlock | ImageBlock;

export interface BuilderState {
  blocks: Block[];
  contextPrompt: string;
  selectedBlockId: string | null;
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  setContextPrompt: (prompt: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (blocks: Block[]) => void;
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
  // Persistence action
  hydrate: () => void;
}
