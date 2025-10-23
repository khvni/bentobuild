/**
 * Canvas Validation Utilities
 *
 * Validation functions and type guards for the Section/Component architecture.
 * These utilities ensure data integrity and type safety.
 *
 * @module lib/validation/canvasValidation
 */

import {
  Section,
  Component,
  Page,
  ComponentType,
  SectionVariant,
  LayoutType,
  PositionType,
} from '@/types/canvas.types';

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a valid Section
 *
 * @param obj - The value to check
 * @returns True if obj is a Section
 */
export function isSection(obj: unknown): obj is Section {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const section = obj as Partial<Section>;

  return (
    typeof section.id === 'string' &&
    section.type === 'section' &&
    typeof section.order === 'number' &&
    typeof section.variant === 'string' &&
    typeof section.position === 'object' &&
    section.position !== null &&
    typeof section.layout === 'object' &&
    section.layout !== null &&
    typeof section.style === 'object' &&
    section.style !== null &&
    Array.isArray(section.children)
  );
}

/**
 * Type guard to check if a value is a valid Component
 *
 * @param obj - The value to check
 * @returns True if obj is a Component
 */
export function isComponent(obj: unknown): obj is Component {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const component = obj as Partial<Component>;

  const validTypes: ComponentType[] = [
    'heading',
    'text',
    'button',
    'image',
    'link',
    'spacer',
    'divider',
  ];

  return (
    typeof component.id === 'string' &&
    typeof component.type === 'string' &&
    validTypes.includes(component.type as ComponentType) &&
    typeof component.position === 'object' &&
    component.position !== null &&
    typeof component.style === 'object' &&
    component.style !== null &&
    typeof component.content === 'object' &&
    component.content !== null
  );
}

/**
 * Type guard to check if a value is a valid Page
 *
 * @param obj - The value to check
 * @returns True if obj is a Page
 */
export function isPage(obj: unknown): obj is Page {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const page = obj as Partial<Page>;

  return (
    typeof page.id === 'string' &&
    Array.isArray(page.sections) &&
    typeof page.viewport === 'object' &&
    page.viewport !== null &&
    typeof page.metadata === 'object' &&
    page.metadata !== null
  );
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a Page structure and returns any validation errors
 *
 * @param page - The page to validate
 * @returns Array of error messages (empty if valid)
 */
export function validatePage(page: unknown): string[] {
  const errors: string[] = [];

  if (!isPage(page)) {
    errors.push('Invalid page structure');
    return errors;
  }

  // Validate page ID
  if (!page.id || page.id.trim() === '') {
    errors.push('Page must have a non-empty ID');
  }

  // Validate sections
  if (!Array.isArray(page.sections)) {
    errors.push('Page sections must be an array');
  } else {
    page.sections.forEach((section, index) => {
      const sectionErrors = validateSection(section);
      sectionErrors.forEach((error) => {
        errors.push(`Section ${index}: ${error}`);
      });
    });
  }

  // Validate viewport
  if (!page.viewport) {
    errors.push('Page must have a viewport');
  } else {
    if (typeof page.viewport.zoom !== 'number' || page.viewport.zoom <= 0) {
      errors.push('Viewport zoom must be a positive number');
    }
    if (typeof page.viewport.x !== 'number') {
      errors.push('Viewport x must be a number');
    }
    if (typeof page.viewport.y !== 'number') {
      errors.push('Viewport y must be a number');
    }
  }

  // Validate metadata
  if (!page.metadata) {
    errors.push('Page must have metadata');
  }

  return errors;
}

/**
 * Validates a Section structure and returns any validation errors
 *
 * @param section - The section to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateSection(section: unknown): string[] {
  const errors: string[] = [];

  if (!isSection(section)) {
    errors.push('Invalid section structure');
    return errors;
  }

  // Validate ID
  if (!section.id || section.id.trim() === '') {
    errors.push('Section must have a non-empty ID');
  }

  // Validate order
  if (typeof section.order !== 'number' || section.order < 0) {
    errors.push('Section order must be a non-negative number');
  }

  // Validate variant
  const validVariants: SectionVariant[] = [
    'navbar',
    'hero',
    'content',
    'features',
    'gallery',
    'testimonials',
    'cta',
    'footer',
  ];
  if (!validVariants.includes(section.variant)) {
    errors.push(`Invalid section variant: ${section.variant}`);
  }

  // Validate position
  if (!section.position) {
    errors.push('Section must have a position');
  } else {
    if (typeof section.position.x !== 'number') {
      errors.push('Section position.x must be a number');
    }
    if (typeof section.position.y !== 'number') {
      errors.push('Section position.y must be a number');
    }
  }

  // Validate layout
  const layoutErrors = validateLayout(section.layout);
  errors.push(...layoutErrors);

  // Validate children
  if (!Array.isArray(section.children)) {
    errors.push('Section children must be an array');
  } else {
    section.children.forEach((component, index) => {
      const componentErrors = validateComponent(component);
      componentErrors.forEach((error) => {
        errors.push(`Component ${index}: ${error}`);
      });
    });
  }

  return errors;
}

/**
 * Validates a Component structure and returns any validation errors
 *
 * @param component - The component to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateComponent(component: unknown): string[] {
  const errors: string[] = [];

  if (!isComponent(component)) {
    errors.push('Invalid component structure');
    return errors;
  }

  // Validate ID
  if (!component.id || component.id.trim() === '') {
    errors.push('Component must have a non-empty ID');
  }

  // Validate type
  const validTypes: ComponentType[] = [
    'heading',
    'text',
    'button',
    'image',
    'link',
    'spacer',
    'divider',
  ];
  if (!validTypes.includes(component.type)) {
    errors.push(`Invalid component type: ${component.type}`);
  }

  // Validate position
  if (!component.position) {
    errors.push('Component must have a position');
  } else {
    const validPositionTypes: PositionType[] = ['relative', 'absolute'];
    if (!validPositionTypes.includes(component.position.type)) {
      errors.push(`Invalid position type: ${component.position.type}`);
    }

    if (component.position.type === 'absolute' && !component.position.absolute) {
      errors.push('Absolute positioned component must have absolute coordinates');
    }
  }

  // Validate content based on component type
  const contentErrors = validateComponentContent(component);
  errors.push(...contentErrors);

  return errors;
}

/**
 * Validates layout configuration
 *
 * @param layout - The layout to validate
 * @returns Array of error messages (empty if valid)
 */
function validateLayout(layout: unknown): string[] {
  const errors: string[] = [];

  if (typeof layout !== 'object' || layout === null) {
    errors.push('Layout must be an object');
    return errors;
  }

  const layoutConfig = layout as any;

  // Validate layout type
  const validLayoutTypes: LayoutType[] = ['stack', 'grid', 'absolute'];
  if (!validLayoutTypes.includes(layoutConfig.type)) {
    errors.push(`Invalid layout type: ${layoutConfig.type}`);
  }

  // Validate stack-specific properties
  if (layoutConfig.type === 'stack') {
    if (
      layoutConfig.direction &&
      !['vertical', 'horizontal'].includes(layoutConfig.direction)
    ) {
      errors.push(`Invalid stack direction: ${layoutConfig.direction}`);
    }
  }

  // Validate grid-specific properties
  if (layoutConfig.type === 'grid') {
    if (layoutConfig.columns !== undefined) {
      if (
        typeof layoutConfig.columns !== 'number' ||
        layoutConfig.columns < 1 ||
        layoutConfig.columns > 12
      ) {
        errors.push('Grid columns must be a number between 1 and 12');
      }
    }
  }

  return errors;
}

/**
 * Validates component content based on component type
 *
 * @param component - The component to validate
 * @returns Array of error messages (empty if valid)
 */
function validateComponentContent(component: Component): string[] {
  const errors: string[] = [];

  switch (component.type) {
    case 'heading':
      if (!component.content.text) {
        errors.push('Heading must have text');
      }
      if (![1, 2, 3, 4, 5, 6].includes(component.content.level)) {
        errors.push('Heading level must be between 1 and 6');
      }
      break;

    case 'text':
      if (!component.content.body) {
        errors.push('Text must have body content');
      }
      break;

    case 'button':
      if (!component.content.text) {
        errors.push('Button must have text');
      }
      if (!component.content.url) {
        errors.push('Button must have a URL');
      }
      if (!['filled', 'outlined', 'text'].includes(component.content.variant)) {
        errors.push('Button variant must be filled, outlined, or text');
      }
      break;

    case 'image':
      if (!component.content.src) {
        errors.push('Image must have a src');
      }
      if (!component.content.alt) {
        errors.push('Image must have alt text for accessibility');
      }
      break;

    case 'link':
      if (!component.content.text) {
        errors.push('Link must have text');
      }
      if (!component.content.url) {
        errors.push('Link must have a URL');
      }
      break;

    case 'spacer':
      if (typeof component.content.height !== 'number' || component.content.height < 0) {
        errors.push('Spacer height must be a non-negative number');
      }
      break;

    case 'divider':
      if (
        component.content.thickness !== undefined &&
        (typeof component.content.thickness !== 'number' ||
          component.content.thickness < 0)
      ) {
        errors.push('Divider thickness must be a non-negative number');
      }
      break;
  }

  return errors;
}

// ============================================================================
// STRUCTURE VALIDATION
// ============================================================================

/**
 * Validates that section orders are sequential and unique
 *
 * @param sections - Array of sections to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateSectionOrder(sections: Section[]): string[] {
  const errors: string[] = [];
  const orders = sections.map((s) => s.order);

  // Check for duplicate orders
  const duplicates = orders.filter(
    (order, index) => orders.indexOf(order) !== index
  );
  if (duplicates.length > 0) {
    errors.push(`Duplicate section orders found: ${duplicates.join(', ')}`);
  }

  // Check that orders start at 0 and are sequential
  const sortedOrders = [...orders].sort((a, b) => a - b);
  for (let i = 0; i < sortedOrders.length; i++) {
    if (sortedOrders[i] !== i) {
      errors.push(
        `Section orders must be sequential starting from 0. Expected ${i}, found ${sortedOrders[i]}`
      );
      break;
    }
  }

  return errors;
}

/**
 * Validates that all IDs in a page are unique
 *
 * @param page - The page to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateUniqueIds(page: Page): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  // Check page ID
  if (ids.has(page.id)) {
    errors.push(`Duplicate ID found: ${page.id}`);
  }
  ids.add(page.id);

  // Check section IDs and component IDs
  page.sections.forEach((section) => {
    if (ids.has(section.id)) {
      errors.push(`Duplicate section ID found: ${section.id}`);
    }
    ids.add(section.id);

    section.children.forEach((component) => {
      if (ids.has(component.id)) {
        errors.push(`Duplicate component ID found: ${component.id}`);
      }
      ids.add(component.id);
    });
  });

  return errors;
}

/**
 * Performs comprehensive validation on a page
 *
 * @param page - The page to validate
 * @returns Object with isValid flag and array of error messages
 */
export function performFullValidation(page: unknown): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Basic structure validation
  const structureErrors = validatePage(page);
  errors.push(...structureErrors);

  if (isPage(page)) {
    // Section order validation
    const orderErrors = validateSectionOrder(page.sections);
    errors.push(...orderErrors);

    // Unique ID validation
    const idErrors = validateUniqueIds(page);
    errors.push(...idErrors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
