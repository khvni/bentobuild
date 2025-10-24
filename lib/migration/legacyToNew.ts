/**
 * Legacy to New Architecture Migration
 *
 * Utility functions to migrate from the old Block-based architecture
 * to the new Page/Section/Component architecture.
 *
 * NOTE: This is a migration utility file. The use of 'any' types is acceptable
 * here as we're dealing with unknown legacy data structures.
 *
 * @module lib/migration/legacyToNew
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { v4 as uuid } from 'uuid';
import {
  Page,
  Section,
  Component,
  SectionVariant,
  HeadingComponent,
  TextComponent,
  ButtonComponent,
  ImageComponent,
  LinkComponent,
  StyleConfig,
} from '@/types/canvas.types';
import { createSection } from '@/lib/factories/sectionFactory';
import {
  createHeading,
  createText,
  createButton,
  createImage,
  createLink,
} from '@/lib/factories/componentFactory';

// ============================================================================
// LEGACY TYPE DEFINITIONS
// ============================================================================

/**
 * Legacy block types from the old architecture
 */
type LegacyBlockType = 'hero' | 'text' | 'image' | 'button' | 'link' | 'navbar' | 'footer';

/**
 * Legacy base block interface
 */
interface LegacyBaseBlock {
  id: string;
  type: LegacyBlockType;
  order: number;
}

/**
 * Legacy hero block
 */
interface LegacyHeroBlock extends LegacyBaseBlock {
  type: 'hero';
  content: {
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    fontFamily?: string;
    fontSize?: string;
  };
}

/**
 * Legacy text block
 */
interface LegacyTextBlock extends LegacyBaseBlock {
  type: 'text';
  content: {
    heading: string;
    body: string;
    backgroundColor?: string;
    headingColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontSize?: string;
  };
}

/**
 * Legacy image block
 */
interface LegacyImageBlock extends LegacyBaseBlock {
  type: 'image';
  content: {
    src: string;
    alt: string;
    caption: string;
    backgroundColor?: string;
    captionColor?: string;
    fontFamily?: string;
  };
}

/**
 * Legacy button block
 */
interface LegacyButtonBlock extends LegacyBaseBlock {
  type: 'button';
  content: {
    text: string;
    url: string;
    style: 'filled' | 'outlined' | 'text';
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    fontFamily?: string;
  };
}

/**
 * Legacy link block
 */
interface LegacyLinkBlock extends LegacyBaseBlock {
  type: 'link';
  content: {
    text: string;
    url: string;
    description: string;
    backgroundColor?: string;
    textColor?: string;
    linkColor?: string;
    fontFamily?: string;
  };
}

/**
 * Legacy navbar block
 */
interface LegacyNavbarBlock extends LegacyBaseBlock {
  type: 'navbar';
  content: {
    brandName: string;
    logoUrl?: string;
    links: Array<{ text: string; url: string }>;
    backgroundColor?: string;
    textColor?: string;
    linkColor?: string;
    linkHoverColor?: string;
    fontFamily?: string;
    fontSize?: string;
  };
}

/**
 * Legacy footer block
 */
interface LegacyFooterBlock extends LegacyBaseBlock {
  type: 'footer';
  content: {
    companyName: string;
    copyright: string;
    socialLinks: Array<{ platform: string; url: string }>;
    contactEmail: string;
    backgroundColor?: string;
    textColor?: string;
    linkColor?: string;
    fontFamily?: string;
    fontSize?: string;
  };
}

/**
 * Legacy block union type
 */
type LegacyBlock =
  | LegacyHeroBlock
  | LegacyTextBlock
  | LegacyImageBlock
  | LegacyButtonBlock
  | LegacyLinkBlock
  | LegacyNavbarBlock
  | LegacyFooterBlock;

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

/**
 * Migrates legacy blocks to new Page structure
 *
 * @param blocks - Array of legacy blocks
 * @param contextPrompt - Optional context prompt to preserve
 * @returns A new Page instance
 *
 * @example
 * ```typescript
 * const oldBlocks = getBlocksFromLocalStorage();
 * const newPage = migrateBlocksToPage(oldBlocks, 'My portfolio site');
 * ```
 */
export function migrateBlocksToPage(blocks: LegacyBlock[], contextPrompt: string = ''): Page {
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  // Convert blocks to sections
  const sections = sortedBlocks.map((block, index) => migrateLegacyBlockToSection(block, index));

  // Create page structure
  const page: Page = {
    id: uuid(),
    sections,
    viewport: {
      zoom: 1,
      x: 0,
      y: 0,
    },
    metadata: {
      title: 'Migrated Page',
      description: contextPrompt || 'Page migrated from legacy architecture',
    },
  };

  return page;
}

/**
 * Migrates a single legacy block to a Section with Component children
 *
 * @param block - Legacy block to migrate
 * @param order - Section order
 * @returns A new Section instance
 */
function migrateLegacyBlockToSection(block: LegacyBlock, order: number): Section {
  switch (block.type) {
    case 'hero':
      return migrateHeroBlock(block, order);

    case 'text':
      return migrateTextBlock(block, order);

    case 'image':
      return migrateImageBlock(block, order);

    case 'button':
      return migrateButtonBlock(block, order);

    case 'link':
      return migrateLinkBlock(block, order);

    case 'navbar':
      return migrateNavbarBlock(block, order);

    case 'footer':
      return migrateFooterBlock(block, order);

    default:
      // Fallback to content section
      return createSection('content', order);
  }
}

/**
 * Migrates a hero block to a hero section with components
 */
function migrateHeroBlock(block: LegacyHeroBlock, order: number): Section {
  const section = createSection('hero', order);

  // Extract styles
  const sectionStyle: StyleConfig = {
    backgroundColor: block.content.backgroundColor,
    textColor: block.content.textColor,
    fontFamily: block.content.fontFamily as any,
  };

  section.style = { ...section.style, ...sectionStyle };

  // Create child components
  const components: Component[] = [];

  // Heading
  if (block.content.heading) {
    components.push(
      createHeading(block.content.heading, 1, 'relative', {
        style: {
          textColor: block.content.textColor,
          fontFamily: block.content.fontFamily as any,
          fontSize: block.content.fontSize,
        },
      })
    );
  }

  // Subheading
  if (block.content.subheading) {
    components.push(
      createText(block.content.subheading, 'relative', {
        style: {
          textColor: block.content.textColor,
          fontFamily: block.content.fontFamily as any,
        },
      })
    );
  }

  // CTA Button
  if (block.content.ctaText) {
    components.push(
      createButton(block.content.ctaText, block.content.ctaLink, 'filled', 'relative', {
        style: {
          backgroundColor: block.content.buttonColor,
          textColor: block.content.buttonTextColor,
        },
      })
    );
  }

  section.children = components;
  return section;
}

/**
 * Migrates a text block to a content section with components
 */
function migrateTextBlock(block: LegacyTextBlock, order: number): Section {
  const section = createSection('content', order);

  // Extract styles
  const sectionStyle: StyleConfig = {
    backgroundColor: block.content.backgroundColor,
    textColor: block.content.textColor,
    fontFamily: block.content.fontFamily as any,
  };

  section.style = { ...section.style, ...sectionStyle };

  // Create child components
  const components: Component[] = [];

  // Heading
  if (block.content.heading) {
    components.push(
      createHeading(block.content.heading, 2, 'relative', {
        style: {
          textColor: block.content.headingColor,
          fontFamily: block.content.fontFamily as any,
          fontSize: block.content.fontSize,
        },
      })
    );
  }

  // Body
  if (block.content.body) {
    components.push(
      createText(block.content.body, 'relative', {
        style: {
          textColor: block.content.textColor,
          fontFamily: block.content.fontFamily as any,
          fontSize: block.content.fontSize,
        },
      })
    );
  }

  section.children = components;
  return section;
}

/**
 * Migrates an image block to a content section with image component
 */
function migrateImageBlock(block: LegacyImageBlock, order: number): Section {
  const section = createSection('content', order);

  // Extract styles
  const sectionStyle: StyleConfig = {
    backgroundColor: block.content.backgroundColor,
    fontFamily: block.content.fontFamily as any,
  };

  section.style = { ...section.style, ...sectionStyle };

  // Create image component
  const imageComponent = createImage(block.content.src, block.content.alt, 'relative', {
    caption: block.content.caption,
    style: {
      fontFamily: block.content.fontFamily as any,
    },
  });

  section.children = [imageComponent];
  return section;
}

/**
 * Migrates a button block to a CTA section with button component
 */
function migrateButtonBlock(block: LegacyButtonBlock, order: number): Section {
  const section = createSection('cta', order);

  // Extract styles
  const sectionStyle: StyleConfig = {
    backgroundColor: block.content.backgroundColor,
    fontFamily: block.content.fontFamily as any,
  };

  section.style = { ...section.style, ...sectionStyle };

  // Create button component
  const buttonComponent = createButton(
    block.content.text,
    block.content.url,
    block.content.style,
    'relative',
    {
      style: {
        backgroundColor: block.content.backgroundColor,
        textColor: block.content.textColor,
        fontFamily: block.content.fontFamily as any,
      },
    }
  );

  section.children = [buttonComponent];
  return section;
}

/**
 * Migrates a link block to a content section with link component
 */
function migrateLinkBlock(block: LegacyLinkBlock, order: number): Section {
  const section = createSection('content', order);

  // Extract styles
  const sectionStyle: StyleConfig = {
    backgroundColor: block.content.backgroundColor,
    textColor: block.content.textColor,
    fontFamily: block.content.fontFamily as any,
  };

  section.style = { ...section.style, ...sectionStyle };

  // Create link component
  const linkComponent = createLink(block.content.text, block.content.url, 'relative', {
    description: block.content.description,
    style: {
      textColor: block.content.linkColor || block.content.textColor,
      fontFamily: block.content.fontFamily as any,
    },
  });

  section.children = [linkComponent];
  return section;
}

/**
 * Migrates a navbar block to a navbar section with components
 */
function migrateNavbarBlock(block: LegacyNavbarBlock, order: number): Section {
  const section = createSection('navbar', order);

  // Extract styles
  const sectionStyle: StyleConfig = {
    backgroundColor: block.content.backgroundColor,
    textColor: block.content.textColor,
    fontFamily: block.content.fontFamily as any,
    fontSize: block.content.fontSize,
  };

  section.style = { ...section.style, ...sectionStyle };

  // Create child components
  const components: Component[] = [];

  // Brand name as heading
  if (block.content.brandName) {
    components.push(
      createHeading(block.content.brandName, 3, 'relative', {
        style: {
          textColor: block.content.textColor,
          fontFamily: block.content.fontFamily as any,
        },
      })
    );
  }

  // Navigation links
  block.content.links.forEach((link) => {
    components.push(
      createLink(link.text, link.url, 'relative', {
        style: {
          textColor: block.content.linkColor || block.content.textColor,
          fontFamily: block.content.fontFamily as any,
        },
      })
    );
  });

  section.children = components;
  return section;
}

/**
 * Migrates a footer block to a footer section with components
 */
function migrateFooterBlock(block: LegacyFooterBlock, order: number): Section {
  const section = createSection('footer', order);

  // Extract styles
  const sectionStyle: StyleConfig = {
    backgroundColor: block.content.backgroundColor,
    textColor: block.content.textColor,
    fontFamily: block.content.fontFamily as any,
    fontSize: block.content.fontSize,
  };

  section.style = { ...section.style, ...sectionStyle };

  // Create child components
  const components: Component[] = [];

  // Company name
  if (block.content.companyName) {
    components.push(
      createText(block.content.companyName, 'relative', {
        style: {
          textColor: block.content.textColor,
          fontFamily: block.content.fontFamily as any,
        },
      })
    );
  }

  // Copyright
  if (block.content.copyright) {
    components.push(
      createText(block.content.copyright, 'relative', {
        style: {
          textColor: block.content.textColor,
          fontFamily: block.content.fontFamily as any,
          fontSize: '0.875rem',
        },
      })
    );
  }

  // Social links
  block.content.socialLinks.forEach((socialLink) => {
    components.push(
      createLink(socialLink.platform, socialLink.url, 'relative', {
        style: {
          textColor: block.content.linkColor || block.content.textColor,
          fontFamily: block.content.fontFamily as any,
        },
      })
    );
  });

  // Contact email
  if (block.content.contactEmail) {
    components.push(
      createLink('Email', `mailto:${block.content.contactEmail}`, 'relative', {
        description: block.content.contactEmail,
        style: {
          textColor: block.content.linkColor || block.content.textColor,
          fontFamily: block.content.fontFamily as any,
        },
      })
    );
  }

  section.children = components;
  return section;
}

// ============================================================================
// MIGRATION VALIDATION
// ============================================================================

/**
 * Validates that legacy blocks can be migrated
 *
 * @param blocks - Legacy blocks to validate
 * @returns Object with isValid flag and error messages
 */
export function validateLegacyBlocks(blocks: unknown[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(blocks)) {
    errors.push('Blocks must be an array');
    return { isValid: false, errors };
  }

  blocks.forEach((block, index) => {
    if (typeof block !== 'object' || block === null) {
      errors.push(`Block ${index} is not an object`);
      return;
    }

    const typedBlock = block as any;

    if (!typedBlock.id || typeof typedBlock.id !== 'string') {
      errors.push(`Block ${index} has invalid or missing ID`);
    }

    if (!typedBlock.type || typeof typedBlock.type !== 'string') {
      errors.push(`Block ${index} has invalid or missing type`);
    }

    if (typeof typedBlock.order !== 'number') {
      errors.push(`Block ${index} has invalid or missing order`);
    }

    if (!typedBlock.content || typeof typedBlock.content !== 'object') {
      errors.push(`Block ${index} has invalid or missing content`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Safely attempts to migrate legacy blocks with error handling
 *
 * @param blocks - Legacy blocks to migrate
 * @param contextPrompt - Optional context prompt
 * @returns Migration result with page or errors
 */
export function safeMigrate(
  blocks: unknown[],
  contextPrompt?: string
): { success: true; page: Page } | { success: false; errors: string[] } {
  // Validate blocks
  const validation = validateLegacyBlocks(blocks);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  try {
    // Attempt migration
    const page = migrateBlocksToPage(blocks as LegacyBlock[], contextPrompt);
    return { success: true, page };
  } catch (error) {
    return {
      success: false,
      errors: [`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}
