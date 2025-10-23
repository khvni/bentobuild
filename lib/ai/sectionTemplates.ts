/**
 * Section Templates Library
 *
 * Pre-defined section structures for common patterns.
 * These templates guide AI generation and provide consistent layouts.
 *
 * @module lib/ai/sectionTemplates
 */

import { SectionVariant, ComponentType } from '@/types/canvas.types';

/**
 * Template definition for a section
 */
export interface SectionTemplate {
  /** Section variant this template applies to */
  variant: SectionVariant;

  /** Layout type for the section */
  layout: 'stack' | 'grid';

  /** Number of columns (for grid layouts) */
  columns?: number;

  /** Direction (for stack layouts) */
  direction?: 'vertical' | 'horizontal';

  /** Component types in order */
  components: ComponentType[];

  /** Description of what this template creates */
  description: string;
}

/**
 * All available section templates
 */
export const sectionTemplates: Record<string, SectionTemplate> = {
  // Hero Section Templates
  'hero-basic': {
    variant: 'hero',
    layout: 'stack',
    direction: 'vertical',
    components: ['heading', 'text', 'button'],
    description: 'Simple hero with heading, subheading, and CTA button',
  },
  'hero-with-image': {
    variant: 'hero',
    layout: 'grid',
    columns: 2,
    components: ['heading', 'text', 'button', 'image'],
    description: 'Hero section with text content on left and image on right',
  },

  // Content Section Templates
  'content-basic': {
    variant: 'content',
    layout: 'stack',
    direction: 'vertical',
    components: ['heading', 'text', 'text'],
    description: 'Content section with heading and multiple paragraphs',
  },
  'content-with-image': {
    variant: 'content',
    layout: 'grid',
    columns: 2,
    components: ['heading', 'text', 'image'],
    description: 'Content section with text and supporting image',
  },

  // Features Section Templates
  'features-3-col': {
    variant: 'features',
    layout: 'grid',
    columns: 3,
    components: ['heading', 'heading', 'text', 'heading', 'text', 'heading', 'text'],
    description: 'Features in 3 columns with individual headings and descriptions',
  },
  'features-2-col': {
    variant: 'features',
    layout: 'grid',
    columns: 2,
    components: ['heading', 'heading', 'text', 'heading', 'text'],
    description: 'Features in 2 columns with individual headings and descriptions',
  },

  // Gallery Section Templates
  'gallery-grid': {
    variant: 'gallery',
    layout: 'grid',
    columns: 3,
    components: ['image', 'image', 'image', 'image', 'image', 'image'],
    description: 'Image gallery in 3-column grid',
  },
  'gallery-masonry': {
    variant: 'gallery',
    layout: 'grid',
    columns: 2,
    components: ['image', 'image', 'image', 'image'],
    description: 'Image gallery in 2-column layout',
  },

  // CTA Section Templates
  'cta-centered': {
    variant: 'cta',
    layout: 'stack',
    direction: 'vertical',
    components: ['heading', 'text', 'button'],
    description: 'Centered call-to-action with heading, description, and button',
  },
  'cta-with-buttons': {
    variant: 'cta',
    layout: 'stack',
    direction: 'vertical',
    components: ['heading', 'text', 'button', 'button'],
    description: 'CTA with primary and secondary action buttons',
  },

  // Testimonials Section Templates
  'testimonials-stack': {
    variant: 'testimonials',
    layout: 'stack',
    direction: 'vertical',
    components: ['heading', 'text', 'text', 'text'],
    description: 'Testimonials stacked vertically',
  },
  'testimonials-grid': {
    variant: 'testimonials',
    layout: 'grid',
    columns: 2,
    components: ['heading', 'text', 'text'],
    description: 'Testimonials in 2-column grid',
  },

  // Navbar Template
  'navbar-standard': {
    variant: 'navbar',
    layout: 'stack',
    direction: 'horizontal',
    components: ['heading', 'link', 'link', 'link', 'button'],
    description: 'Standard navbar with brand, links, and CTA button',
  },

  // Footer Template
  'footer-standard': {
    variant: 'footer',
    layout: 'stack',
    direction: 'horizontal',
    components: ['heading', 'link', 'link', 'link', 'text'],
    description: 'Standard footer with brand, links, and copyright',
  },
};

/**
 * Get the default template for a section variant
 *
 * @param variant - Section variant
 * @returns Default template for that variant
 */
export function getDefaultTemplate(variant: SectionVariant): SectionTemplate {
  const defaultTemplates: Record<SectionVariant, string> = {
    navbar: 'navbar-standard',
    hero: 'hero-basic',
    content: 'content-basic',
    features: 'features-3-col',
    gallery: 'gallery-grid',
    testimonials: 'testimonials-stack',
    cta: 'cta-centered',
    footer: 'footer-standard',
  };

  const templateKey = defaultTemplates[variant];
  return sectionTemplates[templateKey];
}

/**
 * Get all templates for a specific section variant
 *
 * @param variant - Section variant
 * @returns Array of templates for that variant
 */
export function getTemplatesForVariant(variant: SectionVariant): SectionTemplate[] {
  return Object.values(sectionTemplates).filter(t => t.variant === variant);
}

/**
 * Get template by name
 *
 * @param name - Template name
 * @returns Template or undefined if not found
 */
export function getTemplate(name: string): SectionTemplate | undefined {
  return sectionTemplates[name];
}
