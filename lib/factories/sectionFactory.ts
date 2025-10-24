/**
 * Section Factory
 *
 * Factory functions for creating Section instances with sensible defaults
 * based on section variant.
 *
 * @module lib/factories/sectionFactory
 */

import { v4 as uuid } from 'uuid';
import { Section, SectionVariant, LayoutConfig, StyleConfig, Position } from '@/types/canvas.types';

/**
 * Default layout configurations for each section variant
 */
const DEFAULT_LAYOUTS: Record<SectionVariant, LayoutConfig> = {
  navbar: {
    type: 'stack',
    direction: 'horizontal',
    align: 'center',
    justify: 'space-between',
    padding: '1rem 2rem',
    gap: 16,
  },
  hero: {
    type: 'stack',
    direction: 'vertical',
    align: 'center',
    justify: 'center',
    gap: 24,
    padding: '4rem 2rem',
  },
  content: {
    type: 'stack',
    direction: 'vertical',
    gap: 16,
    padding: '3rem 2rem',
  },
  features: {
    type: 'grid',
    columns: 3,
    gap: 32,
    padding: '3rem 2rem',
  },
  gallery: {
    type: 'grid',
    columns: 2,
    gap: 24,
    padding: '3rem 2rem',
  },
  testimonials: {
    type: 'stack',
    direction: 'vertical',
    gap: 24,
    padding: '3rem 2rem',
    align: 'center',
  },
  cta: {
    type: 'stack',
    direction: 'vertical',
    align: 'center',
    justify: 'center',
    gap: 16,
    padding: '4rem 2rem',
  },
  footer: {
    type: 'stack',
    direction: 'horizontal',
    justify: 'space-between',
    align: 'start',
    padding: '2rem',
    gap: 32,
  },
};

/**
 * Default style configurations for each section variant
 */
const DEFAULT_STYLES: Record<SectionVariant, StyleConfig> = {
  navbar: {
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    borderRadius: '0',
  },
  hero: {
    backgroundColor: '#F9FAFB',
    textColor: '#111827',
  },
  content: {
    backgroundColor: '#FFFFFF',
    textColor: '#374151',
  },
  features: {
    backgroundColor: '#F9FAFB',
    textColor: '#111827',
  },
  gallery: {
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
  },
  testimonials: {
    backgroundColor: '#F9FAFB',
    textColor: '#374151',
  },
  cta: {
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
  },
  footer: {
    backgroundColor: '#111827',
    textColor: '#FFFFFF',
  },
};

/**
 * Default heights for sections (used for ReactFlow canvas positioning)
 */
const DEFAULT_HEIGHTS: Record<SectionVariant, number> = {
  navbar: 80,
  hero: 600,
  content: 400,
  features: 500,
  gallery: 600,
  testimonials: 500,
  cta: 400,
  footer: 200,
};

/**
 * Creates a new Section with defaults based on variant
 *
 * @param variant - The section variant (navbar, hero, content, etc.)
 * @param order - The vertical stacking order (0-based)
 * @param position - Optional position override for ReactFlow canvas
 * @returns A new Section instance
 *
 * @example
 * ```typescript
 * const heroSection = createSection('hero', 0);
 * const featuresSection = createSection('features', 1, { x: 0, y: 700 });
 * ```
 */
export function createSection(
  variant: SectionVariant,
  order: number,
  position?: Partial<Position>
): Section {
  const defaultHeight = DEFAULT_HEIGHTS[variant];
  const defaultPosition: Position = {
    x: 0,
    y: order * defaultHeight,
  };

  return {
    id: uuid(),
    type: 'section',
    order,
    variant,
    position: {
      ...defaultPosition,
      ...position,
    },
    layout: { ...DEFAULT_LAYOUTS[variant] },
    style: { ...DEFAULT_STYLES[variant] },
    children: [],
    breakpoints: {
      tablet: {
        layout: getTabletLayoutOverride(variant),
      },
      mobile: {
        layout: getMobileLayoutOverride(variant),
      },
    },
  };
}

/**
 * Gets tablet breakpoint layout overrides for a section variant
 *
 * @param variant - The section variant
 * @returns Partial layout configuration for tablet breakpoint
 */
function getTabletLayoutOverride(variant: SectionVariant): Partial<LayoutConfig> {
  switch (variant) {
    case 'features':
      return { columns: 2 }; // Reduce from 3 to 2 columns

    case 'gallery':
      return { columns: 2 }; // Keep 2 columns

    case 'footer':
      return { direction: 'vertical', align: 'start' }; // Stack vertically

    default:
      return {};
  }
}

/**
 * Gets mobile breakpoint layout overrides for a section variant
 *
 * @param variant - The section variant
 * @returns Partial layout configuration for mobile breakpoint
 */
function getMobileLayoutOverride(variant: SectionVariant): Partial<LayoutConfig> {
  switch (variant) {
    case 'navbar':
      return { direction: 'vertical', align: 'start' }; // Stack vertically

    case 'features':
      return { columns: 1, gap: 24 }; // Single column

    case 'gallery':
      return { columns: 1, gap: 16 }; // Single column

    case 'footer':
      return { direction: 'vertical', align: 'start', gap: 16 }; // Stack vertically

    default:
      return {};
  }
}

/**
 * Creates multiple sections at once from an array of variants
 *
 * @param variants - Array of section variants to create
 * @returns Array of Section instances
 *
 * @example
 * ```typescript
 * const sections = createSections(['navbar', 'hero', 'content', 'footer']);
 * ```
 */
export function createSections(variants: SectionVariant[]): Section[] {
  return variants.map((variant, index) => createSection(variant, index));
}

/**
 * Creates a default website structure with common sections
 *
 * @returns Array of sections forming a basic website
 *
 * @example
 * ```typescript
 * const defaultPage = createDefaultWebsite();
 * // Returns: [navbar, hero, content, cta, footer]
 * ```
 */
export function createDefaultWebsite(): Section[] {
  return createSections(['navbar', 'hero', 'content', 'cta', 'footer']);
}

/**
 * Creates a portfolio website structure
 *
 * @returns Array of sections for a portfolio site
 */
export function createPortfolioWebsite(): Section[] {
  return createSections(['navbar', 'hero', 'content', 'gallery', 'testimonials', 'footer']);
}

/**
 * Creates a landing page structure
 *
 * @returns Array of sections for a landing page
 */
export function createLandingPage(): Section[] {
  return createSections(['navbar', 'hero', 'features', 'cta', 'footer']);
}

/**
 * Clones a section with a new ID and optional overrides
 *
 * @param section - The section to clone
 * @param overrides - Optional property overrides
 * @returns A new Section instance
 */
export function cloneSection(section: Section, overrides?: Partial<Section>): Section {
  return {
    ...section,
    id: uuid(),
    children: section.children.map((child) => ({
      ...child,
      id: uuid(),
    })),
    ...overrides,
  };
}

/**
 * Updates section positions based on their order
 * Useful after reordering sections
 *
 * @param sections - Array of sections to update
 * @returns Array of sections with updated positions
 */
export function updateSectionPositions(sections: Section[]): Section[] {
  let cumulativeHeight = 0;

  return sections.map((section) => {
    const sectionHeight = DEFAULT_HEIGHTS[section.variant];
    const updatedSection = {
      ...section,
      position: {
        x: 0,
        y: cumulativeHeight,
      },
    };

    cumulativeHeight += sectionHeight;
    return updatedSection;
  });
}
