/**
 * Canvas Types for Framer-style Section/Component Architecture
 *
 * This file defines the complete type system for Bentoblocks' new canvas architecture.
 * The system is hierarchical: Page -> Sections -> Components
 *
 * @module types/canvas.types
 */

// ============================================================================
// LAYOUT TYPES
// ============================================================================

/**
 * Supported layout types for sections
 * - stack: Flexbox-based linear layout (vertical or horizontal)
 * - grid: CSS Grid-based 2D layout
 * - absolute: Absolute positioning for free-form layouts
 */
export type LayoutType = 'stack' | 'grid' | 'absolute';

/**
 * Direction for stack layouts
 */
export type StackDirection = 'vertical' | 'horizontal';

/**
 * Alignment options for flexbox and grid layouts
 */
export type Alignment =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'stretch';

// ============================================================================
// POSITION TYPES
// ============================================================================

/**
 * Position type for components within a section
 */
export type PositionType = 'relative' | 'absolute';

/**
 * Absolute position coordinates (in pixels)
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Grid position using CSS Grid syntax
 * Examples:
 * - column: '1 / 3' (span from column 1 to 3)
 * - column: 'span 2' (span 2 columns)
 * - row: '1 / 2' (first row)
 */
export interface GridPosition {
  column: string;
  row: string;
}

// ============================================================================
// LAYOUT CONFIGURATION
// ============================================================================

/**
 * Layout configuration for a section
 * Defines how child components are arranged
 */
export interface LayoutConfig {
  /** Layout type (stack, grid, or absolute) */
  type: LayoutType;

  /** Stack direction (only for stack layout) */
  direction?: StackDirection;

  /** Number of columns (only for grid layout, 1-12) */
  columns?: number;

  /** Gap between child elements in pixels */
  gap?: number;

  /** Cross-axis alignment (align-items for flex, align-content for grid) */
  align?: Alignment;

  /** Main-axis alignment (justify-content) */
  justify?: Alignment;

  /** Padding inside the section (CSS padding shorthand) */
  padding?: string;
}

// ============================================================================
// STYLE CONFIGURATION
// ============================================================================

/**
 * Style configuration for sections and components
 * Contains visual styling properties
 */
export interface StyleConfig {
  /** Background color (CSS color value) */
  backgroundColor?: string;

  /** Text color (CSS color value) */
  textColor?: string;

  /** Font family */
  fontFamily?: FontFamily;

  /** Font size (CSS font-size value) */
  fontSize?: string;

  /** Font weight (100-900) */
  fontWeight?: number;

  /** Padding (CSS padding shorthand) */
  padding?: string;

  /** Margin (CSS margin shorthand) */
  margin?: string;

  /** Border radius (CSS border-radius value) */
  borderRadius?: string;

  /** Additional custom CSS properties */
  [key: string]: string | number | undefined;
}

// ============================================================================
// RESPONSIVE DESIGN
// ============================================================================

/**
 * Breakpoint-specific overrides for layout and style
 */
export interface Breakpoint {
  /** Layout overrides for this breakpoint */
  layout?: Partial<LayoutConfig>;

  /** Style overrides for this breakpoint */
  style?: Partial<StyleConfig>;
}

/**
 * Responsive breakpoints configuration
 * Bentoblocks uses two breakpoints:
 * - tablet: 810px and below
 * - mobile: 480px and below
 */
export interface Breakpoints {
  /** Tablet breakpoint (810px) */
  tablet?: Breakpoint;

  /** Mobile breakpoint (480px) */
  mobile?: Breakpoint;
}

// ============================================================================
// SECTION TYPES
// ============================================================================

/**
 * Section variants with semantic meaning
 * Each variant has default layout and styling
 */
export type SectionVariant =
  | 'navbar'       // Top navigation bar
  | 'hero'         // Hero/banner section
  | 'content'      // General content section
  | 'features'     // Features grid
  | 'gallery'      // Image gallery
  | 'testimonials' // Testimonials/reviews
  | 'cta'          // Call-to-action section
  | 'footer';      // Footer section

/**
 * Section interface - the main container for components
 * Sections stack vertically on the page and define layout for their children
 */
export interface Section {
  /** Unique identifier */
  id: string;

  /** Type discriminator (always 'section') */
  type: 'section';

  /** Vertical stacking order (0-based index) */
  order: number;

  /** Semantic variant that determines default styling */
  variant: SectionVariant;

  /** Position on the ReactFlow canvas (for visual editing) */
  position: Position;

  /** Layout configuration for child components */
  layout: LayoutConfig;

  /** Visual styling for the section */
  style: StyleConfig;

  /** Child components contained in this section */
  children: Component[];

  /** Responsive breakpoint overrides */
  breakpoints?: Breakpoints;
}

// ============================================================================
// COMPONENT TYPES
// ============================================================================

/**
 * All available component types
 */
export type ComponentType =
  | 'heading'   // Heading (h1-h6)
  | 'text'      // Rich text paragraph
  | 'button'    // Call-to-action button
  | 'image'     // Image with optional caption
  | 'link'      // Hyperlink
  | 'spacer'    // Vertical spacing element
  | 'divider';  // Horizontal divider line

/**
 * Base component interface
 * All specific component types extend this interface
 */
export interface BaseComponent {
  /** Unique identifier */
  id: string;

  /** Component type discriminator */
  type: ComponentType;

  /** Position configuration within parent section */
  position: {
    /** Position type (relative or absolute) */
    type: PositionType;

    /** Absolute position (only if type is 'absolute') */
    absolute?: Position;

    /** Grid position (only if parent layout is 'grid') */
    grid?: GridPosition;
  };

  /** Visual styling for the component */
  style: StyleConfig;
}

/**
 * Heading component (h1-h6)
 */
export interface HeadingComponent extends BaseComponent {
  type: 'heading';
  content: {
    /** Heading text */
    text: string;

    /** Heading level (1 = h1, 2 = h2, etc.) */
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

/**
 * Text/paragraph component with rich text support
 */
export interface TextComponent extends BaseComponent {
  type: 'text';
  content: {
    /** Rich text HTML content */
    body: string;
  };
}

/**
 * Button component with variants
 */
export interface ButtonComponent extends BaseComponent {
  type: 'button';
  content: {
    /** Button label text */
    text: string;

    /** Target URL */
    url: string;

    /** Visual variant */
    variant: 'filled' | 'outlined' | 'text';
  };
}

/**
 * Image component with responsive support
 */
export interface ImageComponent extends BaseComponent {
  type: 'image';
  content: {
    /** Image source URL */
    src: string;

    /** Alt text for accessibility */
    alt: string;

    /** Optional caption */
    caption?: string;

    /** Object-fit CSS property */
    objectFit?: 'cover' | 'contain' | 'fill';
  };
}

/**
 * Link component (inline hyperlink)
 */
export interface LinkComponent extends BaseComponent {
  type: 'link';
  content: {
    /** Link text */
    text: string;

    /** Target URL */
    url: string;

    /** Optional description/tooltip */
    description?: string;
  };
}

/**
 * Spacer component for vertical spacing
 */
export interface SpacerComponent extends BaseComponent {
  type: 'spacer';
  content: {
    /** Height in pixels */
    height: number;
  };
}

/**
 * Divider component (horizontal line)
 */
export interface DividerComponent extends BaseComponent {
  type: 'divider';
  content: {
    /** Divider color (CSS color value) */
    color?: string;

    /** Line thickness in pixels */
    thickness?: number;
  };
}

/**
 * Component union type (discriminated union)
 * Use TypeScript's type narrowing to determine specific component type
 */
export type Component =
  | HeadingComponent
  | TextComponent
  | ButtonComponent
  | ImageComponent
  | LinkComponent
  | SpacerComponent
  | DividerComponent;

// ============================================================================
// PAGE STRUCTURE
// ============================================================================

/**
 * Page metadata
 */
export interface PageMetadata {
  /** Page title (for SEO and browser tab) */
  title?: string;

  /** Meta description (for SEO) */
  description?: string;

  /** Favicon URL */
  favicon?: string;
}

/**
 * Viewport state for canvas editing
 */
export interface Viewport {
  /** Zoom level (1 = 100%, 0.5 = 50%, 2 = 200%) */
  zoom: number;

  /** Horizontal pan offset */
  x: number;

  /** Vertical pan offset */
  y: number;
}

/**
 * Page interface - the root container for all sections
 * Represents a complete website page
 */
export interface Page {
  /** Unique page identifier */
  id: string;

  /** All sections on the page (ordered by section.order) */
  sections: Section[];

  /** Viewport state for canvas editor */
  viewport: Viewport;

  /** Page metadata */
  metadata: PageMetadata;
}

// ============================================================================
// FONT TYPES
// ============================================================================

/**
 * Available font families in Bentoblocks
 * These fonts are loaded via Google Fonts
 */
export type FontFamily =
  | 'Inter'
  | 'Instrument Serif'
  | 'Noto Sans'
  | 'Lexend'
  | 'Manrope'
  | 'EB Garamond'
  | 'Playfair Display'
  | 'Roboto'
  | 'Open Sans'
  | 'Lato'
  | 'Montserrat'
  | 'Poppins';

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Type guard for checking if a value is a Section
 */
export function isSectionType(obj: unknown): obj is Section {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    obj.type === 'section'
  );
}

/**
 * Type guard for checking if a value is a Component
 */
export function isComponentType(obj: unknown): obj is Component {
  const componentTypes: ComponentType[] = [
    'heading',
    'text',
    'button',
    'image',
    'link',
    'spacer',
    'divider'
  ];

  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    componentTypes.includes(obj.type as ComponentType)
  );
}
