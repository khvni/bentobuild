export type BlockType = 'hero' | 'text' | 'image' | 'button' | 'link' | 'navbar';

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
    // Color properties
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
  };
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: {
    heading: string;
    body: string;
    // Color properties
    backgroundColor?: string;
    headingColor?: string;
    textColor?: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
    caption: string;
    // Color properties
    backgroundColor?: string;
    captionColor?: string;
  };
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  content: {
    text: string;
    url: string;
    style: 'filled' | 'outlined' | 'text';
    // Color properties
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

export interface LinkBlock extends BaseBlock {
  type: 'link';
  content: {
    text: string;
    url: string;
    description: string;
    // Color properties
    backgroundColor?: string;
    textColor?: string;
    linkColor?: string;
  };
}

export interface NavbarBlock extends BaseBlock {
  type: 'navbar';
  content: {
    brandName: string;
    logoUrl?: string;
    links: Array<{ text: string; url: string }>;
    // Color properties
    backgroundColor?: string;
    textColor?: string;
    linkColor?: string;
    linkHoverColor?: string;
  };
}

export type Block = HeroBlock | TextBlock | ImageBlock | ButtonBlock | LinkBlock | NavbarBlock;

export type FontFamily = 'sans' | 'serif';

export interface BuilderState {
  blocks: Block[];
  contextPrompt: string;
  selectedBlockId: string | null;
  selectedFont: FontFamily;
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  setContextPrompt: (prompt: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (blocks: Block[]) => void;
  setFont: (font: FontFamily) => void;
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
  // Persistence action
  hydrate: () => void;
}
