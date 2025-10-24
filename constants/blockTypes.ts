/**
 * Block type constants
 * Centralized block type definitions to ensure consistency across the application
 */

export const BLOCK_TYPES = {
  HERO: 'hero',
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  LINK: 'link',
  NAVBAR: 'navbar',
  FOOTER: 'footer',
} as const;

export const BLOCK_TYPE_LABELS: Record<string, string> = {
  [BLOCK_TYPES.HERO]: 'Hero Section',
  [BLOCK_TYPES.TEXT]: 'Text Block',
  [BLOCK_TYPES.IMAGE]: 'Image Block',
  [BLOCK_TYPES.BUTTON]: 'Button',
  [BLOCK_TYPES.LINK]: 'Link',
  [BLOCK_TYPES.NAVBAR]: 'Navigation Bar',
  [BLOCK_TYPES.FOOTER]: 'Footer',
};

export const BLOCK_TYPE_DESCRIPTIONS: Record<string, string> = {
  [BLOCK_TYPES.HERO]: 'Eye-catching hero section with heading, subheading, and CTA',
  [BLOCK_TYPES.TEXT]: 'Rich text content with heading and body',
  [BLOCK_TYPES.IMAGE]: 'Image with caption and alt text',
  [BLOCK_TYPES.BUTTON]: 'Call-to-action button',
  [BLOCK_TYPES.LINK]: 'Clickable link with description',
  [BLOCK_TYPES.NAVBAR]: 'Site navigation with brand and links',
  [BLOCK_TYPES.FOOTER]: 'Footer with company info and social links',
};

/**
 * Block types that should appear at specific positions
 */
export const STRUCTURAL_BLOCKS = [BLOCK_TYPES.NAVBAR, BLOCK_TYPES.FOOTER] as const;

/**
 * Block types that contain primarily content
 */
export const CONTENT_BLOCKS = [BLOCK_TYPES.HERO, BLOCK_TYPES.TEXT, BLOCK_TYPES.IMAGE] as const;

/**
 * Block types that are interactive elements
 */
export const INTERACTIVE_BLOCKS = [BLOCK_TYPES.BUTTON, BLOCK_TYPES.LINK] as const;
