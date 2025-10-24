/**
 * Component Factory
 *
 * Factory functions for creating Component instances with sensible defaults.
 *
 * @module lib/factories/componentFactory
 */

import { v4 as uuid } from 'uuid';
import {
  Component,
  ComponentType,
  HeadingComponent,
  TextComponent,
  ButtonComponent,
  ImageComponent,
  LinkComponent,
  SpacerComponent,
  DividerComponent,
  StyleConfig,
  PositionType,
  Position,
  GridPosition,
} from '@/types/canvas.types';

/**
 * Default style configurations for each component type
 */
const DEFAULT_STYLES: Record<ComponentType, StyleConfig> = {
  heading: {
    fontFamily: 'Inter',
    fontWeight: 700,
    textColor: '#111827',
  },
  text: {
    fontFamily: 'Inter',
    fontSize: '1rem',
    textColor: '#374151',
  },
  button: {
    fontFamily: 'Inter',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
  },
  image: {
    borderRadius: '0.5rem',
  },
  link: {
    fontFamily: 'Inter',
    fontSize: '1rem',
    textColor: '#3B82F6',
  },
  spacer: {},
  divider: {
    backgroundColor: '#E5E7EB',
  },
};

/**
 * Creates a base component structure with common properties
 */
function createBaseComponent(
  type: ComponentType,
  positionType: PositionType = 'relative',
  absolutePos?: Position,
  gridPos?: GridPosition
): Omit<Component, 'content'> {
  return {
    id: uuid(),
    type,
    position: {
      type: positionType,
      absolute: absolutePos,
      grid: gridPos,
    },
    style: { ...DEFAULT_STYLES[type] },
  };
}

// ============================================================================
// HEADING COMPONENT
// ============================================================================

/**
 * Creates a new Heading component
 *
 * @param text - Heading text content
 * @param level - Heading level (1-6, where 1 = h1, 2 = h2, etc.)
 * @param positionType - Position type (relative or absolute)
 * @param options - Optional overrides for position and style
 * @returns A new HeadingComponent instance
 *
 * @example
 * ```typescript
 * const h1 = createHeading('Welcome to my site', 1);
 * const h2 = createHeading('About Me', 2, 'relative', {
 *   style: { fontSize: '2rem' }
 * });
 * ```
 */
export function createHeading(
  text: string = 'Heading',
  level: 1 | 2 | 3 | 4 | 5 | 6 = 2,
  positionType: PositionType = 'relative',
  options?: {
    absolute?: Position;
    grid?: GridPosition;
    style?: Partial<StyleConfig>;
  }
): HeadingComponent {
  const base = createBaseComponent('heading', positionType, options?.absolute, options?.grid);

  // Set default font size based on level
  const fontSizes: Record<number, string> = {
    1: '3rem',
    2: '2.5rem',
    3: '2rem',
    4: '1.5rem',
    5: '1.25rem',
    6: '1rem',
  };

  return {
    ...base,
    type: 'heading',
    content: {
      text,
      level,
    },
    style: {
      ...base.style,
      fontSize: fontSizes[level],
      ...options?.style,
    },
  };
}

// ============================================================================
// TEXT COMPONENT
// ============================================================================

/**
 * Creates a new Text component
 *
 * @param body - Text content (can be HTML for rich text)
 * @param positionType - Position type (relative or absolute)
 * @param options - Optional overrides for position and style
 * @returns A new TextComponent instance
 *
 * @example
 * ```typescript
 * const paragraph = createText('This is a paragraph of text.');
 * const richText = createText('<p>This has <strong>bold</strong> text.</p>');
 * ```
 */
export function createText(
  body: string = 'Text content',
  positionType: PositionType = 'relative',
  options?: {
    absolute?: Position;
    grid?: GridPosition;
    style?: Partial<StyleConfig>;
  }
): TextComponent {
  const base = createBaseComponent('text', positionType, options?.absolute, options?.grid);

  return {
    ...base,
    type: 'text',
    content: {
      body,
    },
    style: {
      ...base.style,
      ...options?.style,
    },
  };
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

/**
 * Creates a new Button component
 *
 * @param text - Button label text
 * @param url - Target URL
 * @param variant - Button variant (filled, outlined, text)
 * @param positionType - Position type (relative or absolute)
 * @param options - Optional overrides for position and style
 * @returns A new ButtonComponent instance
 *
 * @example
 * ```typescript
 * const ctaButton = createButton('Get Started', '/signup', 'filled');
 * const secondaryButton = createButton('Learn More', '/about', 'outlined');
 * ```
 */
export function createButton(
  text: string = 'Button',
  url: string = '#',
  variant: 'filled' | 'outlined' | 'text' = 'filled',
  positionType: PositionType = 'relative',
  options?: {
    absolute?: Position;
    grid?: GridPosition;
    style?: Partial<StyleConfig>;
  }
): ButtonComponent {
  const base = createBaseComponent('button', positionType, options?.absolute, options?.grid);

  // Adjust styles based on variant
  let variantStyles: Partial<StyleConfig> = {};

  if (variant === 'outlined') {
    variantStyles = {
      backgroundColor: 'transparent',
      textColor: '#3B82F6',
      borderRadius: '0.5rem',
    };
  } else if (variant === 'text') {
    variantStyles = {
      backgroundColor: 'transparent',
      textColor: '#3B82F6',
      padding: '0.5rem 1rem',
    };
  }

  return {
    ...base,
    type: 'button',
    content: {
      text,
      url,
      variant,
    },
    style: {
      ...base.style,
      ...variantStyles,
      ...options?.style,
    },
  };
}

// ============================================================================
// IMAGE COMPONENT
// ============================================================================

/**
 * Creates a new Image component
 *
 * @param src - Image source URL
 * @param alt - Alt text for accessibility
 * @param positionType - Position type (relative or absolute)
 * @param options - Optional overrides for caption, objectFit, position, and style
 * @returns A new ImageComponent instance
 *
 * @example
 * ```typescript
 * const heroImage = createImage(
 *   'https://images.unsplash.com/photo-123',
 *   'Hero image'
 * );
 * const coverImage = createImage(
 *   '/images/banner.jpg',
 *   'Banner',
 *   'relative',
 *   { objectFit: 'cover' }
 * );
 * ```
 */
export function createImage(
  src: string = 'https://via.placeholder.com/800x600',
  alt: string = 'Image',
  positionType: PositionType = 'relative',
  options?: {
    caption?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
    absolute?: Position;
    grid?: GridPosition;
    style?: Partial<StyleConfig>;
  }
): ImageComponent {
  const base = createBaseComponent('image', positionType, options?.absolute, options?.grid);

  return {
    ...base,
    type: 'image',
    content: {
      src,
      alt,
      caption: options?.caption,
      objectFit: options?.objectFit || 'cover',
    },
    style: {
      ...base.style,
      ...options?.style,
    },
  };
}

// ============================================================================
// LINK COMPONENT
// ============================================================================

/**
 * Creates a new Link component
 *
 * @param text - Link text
 * @param url - Target URL
 * @param positionType - Position type (relative or absolute)
 * @param options - Optional overrides for description, position, and style
 * @returns A new LinkComponent instance
 *
 * @example
 * ```typescript
 * const link = createLink('Visit our blog', '/blog');
 * const externalLink = createLink(
 *   'GitHub',
 *   'https://github.com/user/repo',
 *   'relative',
 *   { description: 'View source code' }
 * );
 * ```
 */
export function createLink(
  text: string = 'Link',
  url: string = '#',
  positionType: PositionType = 'relative',
  options?: {
    description?: string;
    absolute?: Position;
    grid?: GridPosition;
    style?: Partial<StyleConfig>;
  }
): LinkComponent {
  const base = createBaseComponent('link', positionType, options?.absolute, options?.grid);

  return {
    ...base,
    type: 'link',
    content: {
      text,
      url,
      description: options?.description,
    },
    style: {
      ...base.style,
      ...options?.style,
    },
  };
}

// ============================================================================
// SPACER COMPONENT
// ============================================================================

/**
 * Creates a new Spacer component
 *
 * @param height - Height in pixels
 * @param positionType - Position type (relative or absolute)
 * @param options - Optional overrides for position and style
 * @returns A new SpacerComponent instance
 *
 * @example
 * ```typescript
 * const spacer = createSpacer(32); // 32px vertical space
 * const largeSpacer = createSpacer(64);
 * ```
 */
export function createSpacer(
  height: number = 32,
  positionType: PositionType = 'relative',
  options?: {
    absolute?: Position;
    grid?: GridPosition;
    style?: Partial<StyleConfig>;
  }
): SpacerComponent {
  const base = createBaseComponent('spacer', positionType, options?.absolute, options?.grid);

  return {
    ...base,
    type: 'spacer',
    content: {
      height,
    },
    style: {
      ...base.style,
      ...options?.style,
    },
  };
}

// ============================================================================
// DIVIDER COMPONENT
// ============================================================================

/**
 * Creates a new Divider component
 *
 * @param positionType - Position type (relative or absolute)
 * @param options - Optional overrides for color, thickness, position, and style
 * @returns A new DividerComponent instance
 *
 * @example
 * ```typescript
 * const divider = createDivider();
 * const thickDivider = createDivider('relative', {
 *   color: '#3B82F6',
 *   thickness: 2
 * });
 * ```
 */
export function createDivider(
  positionType: PositionType = 'relative',
  options?: {
    color?: string;
    thickness?: number;
    absolute?: Position;
    grid?: GridPosition;
    style?: Partial<StyleConfig>;
  }
): DividerComponent {
  const base = createBaseComponent('divider', positionType, options?.absolute, options?.grid);

  return {
    ...base,
    type: 'divider',
    content: {
      color: options?.color || '#E5E7EB',
      thickness: options?.thickness || 1,
    },
    style: {
      ...base.style,
      ...options?.style,
    },
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clones a component with a new ID and optional overrides
 *
 * @param component - The component to clone
 * @param overrides - Optional property overrides
 * @returns A new Component instance
 */
export function cloneComponent<T extends Component>(component: T, overrides?: Partial<T>): T {
  return {
    ...component,
    id: uuid(),
    ...overrides,
  } as T;
}

/**
 * Creates a grid position for a component
 *
 * @param column - CSS Grid column value (e.g., '1 / 3', 'span 2')
 * @param row - CSS Grid row value (e.g., '1 / 2', 'span 1')
 * @returns GridPosition object
 *
 * @example
 * ```typescript
 * const gridPos = createGridPosition('1 / 3', '1 / 2');
 * const spanPos = createGridPosition('span 2', 'span 1');
 * ```
 */
export function createGridPosition(column: string, row: string): GridPosition {
  return { column, row };
}

/**
 * Creates an absolute position for a component
 *
 * @param x - Horizontal position in pixels
 * @param y - Vertical position in pixels
 * @returns Position object
 *
 * @example
 * ```typescript
 * const pos = createAbsolutePosition(100, 200);
 * ```
 */
export function createAbsolutePosition(x: number, y: number): Position {
  return { x, y };
}
