export type BlockType = 'hero' | 'text' | 'image' | 'button' | 'link' | 'navbar' | 'footer';

export type FontFamily =
  | 'Inter'
  | 'Instrument Serif'
  | 'Noto Sans'
  | 'Lexend'
  | 'Manrope'
  | 'EB Garamond'
  | 'Playfair Display';

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
    // Typography properties
    fontFamily?: FontFamily;
    fontSize?: string;
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
    // Typography properties
    fontFamily?: FontFamily;
    fontSize?: string;
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
    // Typography properties
    fontFamily?: FontFamily;
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
    // Typography properties
    fontFamily?: FontFamily;
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
    // Typography properties
    fontFamily?: FontFamily;
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
    // Typography properties
    fontFamily?: FontFamily;
    fontSize?: string;
  };
}

export interface FooterBlock extends BaseBlock {
  type: 'footer';
  content: {
    companyName: string;
    copyright: string;
    socialLinks: Array<{ platform: string; url: string }>;
    contactEmail: string;
    // Color properties
    backgroundColor?: string;
    textColor?: string;
    linkColor?: string;
    // Typography properties
    fontFamily?: FontFamily;
    fontSize?: string;
  };
}

export type Block = HeroBlock | TextBlock | ImageBlock | ButtonBlock | LinkBlock | NavbarBlock | FooterBlock;

// Import canvas types for new Page-based architecture
import { Page, Section, Component } from './canvas.types';

export interface BuilderState {
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
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
  // Persistence action
  hydrate: () => void;
  // New Page-based architecture
  page: Page | null;
  addSection: (section: Section) => void;
  addSectionWithComponents: (section: Section) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  addComponent: (sectionId: string, component: Component) => void;
  updateComponent: (sectionId: string, componentId: string, updates: Partial<Component>) => void;
  deleteComponent: (sectionId: string, componentId: string) => void;
  setPage: (page: Page) => void;
}
