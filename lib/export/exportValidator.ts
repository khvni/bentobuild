/**
 * Export Validation for Bentoblocks
 *
 * Validates Page structure before exporting to ensure
 * complete and valid HTML output.
 *
 * @module lib/export/exportValidator
 */

import { Page, Section, Component } from '@/types/canvas.types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether the page is valid for export */
  valid: boolean;

  /** Array of validation error messages */
  errors: string[];

  /** Array of validation warnings (non-blocking) */
  warnings: string[];
}

/**
 * Validate a Page for export
 *
 * Checks for:
 * - At least one section exists
 * - All sections have valid structure
 * - All components have required content
 * - No critical missing data
 *
 * @param page - Page to validate
 * @returns Validation result with errors and warnings
 */
export function validatePageForExport(page: Page): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check page exists
  if (!page) {
    errors.push('Page is null or undefined');
    return { valid: false, errors, warnings };
  }

  // Check sections exist
  if (!page.sections || page.sections.length === 0) {
    errors.push('Page has no sections. Add at least one section to export.');
    return { valid: false, errors, warnings };
  }

  // Validate metadata
  if (!page.metadata?.title || page.metadata.title.trim() === '') {
    warnings.push('Page has no title. Using default title "Bentoblocks Site".');
  }

  if (!page.metadata?.description || page.metadata.description.trim() === '') {
    warnings.push('Page has no meta description. Consider adding one for SEO.');
  }

  // Validate each section
  page.sections.forEach((section, index) => {
    validateSection(section, index, errors, warnings);
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a single Section
 */
function validateSection(
  section: Section,
  index: number,
  errors: string[],
  warnings: string[]
): void {
  // Check section has ID
  if (!section.id) {
    errors.push(`Section at index ${index} has no ID`);
  }

  // Check section has layout
  if (!section.layout || !section.layout.type) {
    errors.push(`Section "${section.variant || index}" has no layout configuration`);
  }

  // Check section has children
  if (!section.children || section.children.length === 0) {
    warnings.push(
      `Section "${section.variant || index}" has no components. It will render as empty.`
    );
    return; // No need to validate components if there are none
  }

  // Validate each component in the section
  section.children.forEach((component, componentIndex) => {
    validateComponent(component, section, componentIndex, errors, warnings);
  });
}

/**
 * Validate a single Component
 */
function validateComponent(
  component: Component,
  section: Section,
  index: number,
  errors: string[],
  warnings: string[]
): void {
  const componentId = `${section.variant}-component-${index}`;

  // Check component has ID
  if (!component.id) {
    errors.push(`Component at ${componentId} has no ID`);
  }

  // Check component has type
  if (!component.type) {
    errors.push(`Component at ${componentId} has no type`);
    return;
  }

  // Validate component-specific content
  switch (component.type) {
    case 'heading':
      if (!component.content.text || component.content.text.trim() === '') {
        warnings.push(`Heading component at ${componentId} has no text`);
      }
      if (!component.content.level || component.content.level < 1 || component.content.level > 6) {
        errors.push(`Heading component at ${componentId} has invalid level`);
      }
      break;

    case 'text':
      if (!component.content.body || component.content.body.trim() === '') {
        warnings.push(`Text component at ${componentId} has no content`);
      }
      break;

    case 'button':
      if (!component.content.text || component.content.text.trim() === '') {
        warnings.push(`Button component at ${componentId} has no text`);
      }
      if (!component.content.url) {
        errors.push(`Button component at ${componentId} has no URL`);
      } else if (!isValidUrl(component.content.url)) {
        warnings.push(
          `Button component at ${componentId} has invalid URL: ${component.content.url}`
        );
      }
      break;

    case 'image':
      if (!component.content.src || component.content.src.trim() === '') {
        errors.push(`Image component at ${componentId} has no source URL`);
      }
      if (!component.content.alt) {
        warnings.push(
          `Image component at ${componentId} has no alt text (important for accessibility)`
        );
      }
      break;

    case 'link':
      if (!component.content.text || component.content.text.trim() === '') {
        warnings.push(`Link component at ${componentId} has no text`);
      }
      if (!component.content.url) {
        errors.push(`Link component at ${componentId} has no URL`);
      } else if (!isValidUrl(component.content.url)) {
        warnings.push(`Link component at ${componentId} has invalid URL: ${component.content.url}`);
      }
      break;

    case 'spacer':
      if (!component.content.height || component.content.height <= 0) {
        errors.push(`Spacer component at ${componentId} has invalid height`);
      }
      break;

    case 'divider':
      // Divider is valid even with default values
      if (component.content.thickness && component.content.thickness <= 0) {
        warnings.push(`Divider component at ${componentId} has invalid thickness`);
      }
      break;

    default:
      // This should never happen if all component types are properly handled
      errors.push(`Component at ${componentId} has unknown type: ${(component as Component).type}`);
  }
}

/**
 * Check if a string is a valid URL
 */
function isValidUrl(url: string): boolean {
  // Allow relative URLs
  if (url.startsWith('/') || url.startsWith('#')) {
    return true;
  }

  // Check absolute URLs
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Quick validation - just check if page can be exported
 * Returns true if valid, false otherwise
 */
export function canExport(page: Page | null): boolean {
  if (!page || !page.sections || page.sections.length === 0) {
    return false;
  }

  return true;
}

/**
 * Get a user-friendly validation summary message
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.valid) {
    if (result.warnings.length > 0) {
      return `Export ready with ${result.warnings.length} warning(s)`;
    }
    return 'Export ready';
  }

  return `Cannot export: ${result.errors.length} error(s) found`;
}
