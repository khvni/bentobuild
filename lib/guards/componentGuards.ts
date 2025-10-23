/**
 * Component Type Guards
 *
 * Type guard functions for narrowing Component discriminated union types.
 * These guards enable TypeScript to correctly infer specific component types.
 *
 * @module lib/guards/componentGuards
 */

import {
  Component,
  HeadingComponent,
  TextComponent,
  ButtonComponent,
  ImageComponent,
  LinkComponent,
  SpacerComponent,
  DividerComponent,
} from '@/types/canvas.types';

// ============================================================================
// COMPONENT TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a component is a HeadingComponent
 *
 * @param component - The component to check
 * @returns True if component is a HeadingComponent
 *
 * @example
 * ```typescript
 * if (isHeadingComponent(component)) {
 *   // TypeScript knows component.content.level exists
 *   console.log(component.content.level);
 * }
 * ```
 */
export function isHeadingComponent(
  component: Component
): component is HeadingComponent {
  return component.type === 'heading';
}

/**
 * Type guard to check if a component is a TextComponent
 *
 * @param component - The component to check
 * @returns True if component is a TextComponent
 *
 * @example
 * ```typescript
 * if (isTextComponent(component)) {
 *   // TypeScript knows component.content.body exists
 *   console.log(component.content.body);
 * }
 * ```
 */
export function isTextComponent(
  component: Component
): component is TextComponent {
  return component.type === 'text';
}

/**
 * Type guard to check if a component is a ButtonComponent
 *
 * @param component - The component to check
 * @returns True if component is a ButtonComponent
 *
 * @example
 * ```typescript
 * if (isButtonComponent(component)) {
 *   // TypeScript knows component.content.variant exists
 *   console.log(component.content.variant);
 * }
 * ```
 */
export function isButtonComponent(
  component: Component
): component is ButtonComponent {
  return component.type === 'button';
}

/**
 * Type guard to check if a component is an ImageComponent
 *
 * @param component - The component to check
 * @returns True if component is an ImageComponent
 *
 * @example
 * ```typescript
 * if (isImageComponent(component)) {
 *   // TypeScript knows component.content.src and alt exist
 *   console.log(component.content.src, component.content.alt);
 * }
 * ```
 */
export function isImageComponent(
  component: Component
): component is ImageComponent {
  return component.type === 'image';
}

/**
 * Type guard to check if a component is a LinkComponent
 *
 * @param component - The component to check
 * @returns True if component is a LinkComponent
 *
 * @example
 * ```typescript
 * if (isLinkComponent(component)) {
 *   // TypeScript knows component.content.url exists
 *   console.log(component.content.url);
 * }
 * ```
 */
export function isLinkComponent(
  component: Component
): component is LinkComponent {
  return component.type === 'link';
}

/**
 * Type guard to check if a component is a SpacerComponent
 *
 * @param component - The component to check
 * @returns True if component is a SpacerComponent
 *
 * @example
 * ```typescript
 * if (isSpacerComponent(component)) {
 *   // TypeScript knows component.content.height exists
 *   console.log(component.content.height);
 * }
 * ```
 */
export function isSpacerComponent(
  component: Component
): component is SpacerComponent {
  return component.type === 'spacer';
}

/**
 * Type guard to check if a component is a DividerComponent
 *
 * @param component - The component to check
 * @returns True if component is a DividerComponent
 *
 * @example
 * ```typescript
 * if (isDividerComponent(component)) {
 *   // TypeScript knows component.content.thickness exists
 *   console.log(component.content.thickness);
 * }
 * ```
 */
export function isDividerComponent(
  component: Component
): component is DividerComponent {
  return component.type === 'divider';
}

// ============================================================================
// CONTENT TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a component has editable text content
 * (Heading, Text, Button, or Link)
 *
 * @param component - The component to check
 * @returns True if component has text content
 */
export function hasTextContent(
  component: Component
): component is HeadingComponent | TextComponent | ButtonComponent | LinkComponent {
  return (
    isHeadingComponent(component) ||
    isTextComponent(component) ||
    isButtonComponent(component) ||
    isLinkComponent(component)
  );
}

/**
 * Type guard to check if a component has URL content
 * (Button or Link)
 *
 * @param component - The component to check
 * @returns True if component has URL content
 */
export function hasUrlContent(
  component: Component
): component is ButtonComponent | LinkComponent {
  return isButtonComponent(component) || isLinkComponent(component);
}

/**
 * Type guard to check if a component is interactive
 * (Button or Link)
 *
 * @param component - The component to check
 * @returns True if component is interactive
 */
export function isInteractiveComponent(
  component: Component
): component is ButtonComponent | LinkComponent {
  return hasUrlContent(component);
}

/**
 * Type guard to check if a component displays media
 * (Image only for now, could include video in future)
 *
 * @param component - The component to check
 * @returns True if component displays media
 */
export function isMediaComponent(
  component: Component
): component is ImageComponent {
  return isImageComponent(component);
}

/**
 * Type guard to check if a component is a layout element
 * (Spacer or Divider)
 *
 * @param component - The component to check
 * @returns True if component is a layout element
 */
export function isLayoutComponent(
  component: Component
): component is SpacerComponent | DividerComponent {
  return isSpacerComponent(component) || isDividerComponent(component);
}

// ============================================================================
// UTILITY GUARDS
// ============================================================================

/**
 * Filters an array of components to only include a specific type
 *
 * @param components - Array of components to filter
 * @param type - The component type to filter for
 * @returns Filtered array of components
 *
 * @example
 * ```typescript
 * const headings = filterComponentsByType(section.children, 'heading');
 * // headings is typed as HeadingComponent[]
 * ```
 */
export function filterComponentsByType<T extends Component['type']>(
  components: Component[],
  type: T
): Extract<Component, { type: T }>[] {
  return components.filter((c) => c.type === type) as Extract<
    Component,
    { type: T }
  >[];
}

/**
 * Finds the first component of a specific type in an array
 *
 * @param components - Array of components to search
 * @param type - The component type to find
 * @returns The first component of the specified type, or undefined
 *
 * @example
 * ```typescript
 * const firstButton = findComponentByType(section.children, 'button');
 * if (firstButton) {
 *   console.log(firstButton.content.text);
 * }
 * ```
 */
export function findComponentByType<T extends Component['type']>(
  components: Component[],
  type: T
): Extract<Component, { type: T }> | undefined {
  return components.find((c) => c.type === type) as
    | Extract<Component, { type: T }>
    | undefined;
}

/**
 * Checks if an array of components contains a specific type
 *
 * @param components - Array of components to check
 * @param type - The component type to look for
 * @returns True if at least one component of the type exists
 *
 * @example
 * ```typescript
 * if (hasComponentType(section.children, 'image')) {
 *   console.log('This section contains images');
 * }
 * ```
 */
export function hasComponentType(
  components: Component[],
  type: Component['type']
): boolean {
  return components.some((c) => c.type === type);
}

/**
 * Gets all unique component types in an array
 *
 * @param components - Array of components
 * @returns Array of unique component types
 *
 * @example
 * ```typescript
 * const types = getComponentTypes(section.children);
 * // ['heading', 'text', 'button']
 * ```
 */
export function getComponentTypes(components: Component[]): Component['type'][] {
  return Array.from(new Set(components.map((c) => c.type)));
}

/**
 * Counts components by type in an array
 *
 * @param components - Array of components
 * @returns Map of component types to their counts
 *
 * @example
 * ```typescript
 * const counts = countComponentsByType(section.children);
 * console.log(counts.get('heading')); // 3
 * console.log(counts.get('button')); // 2
 * ```
 */
export function countComponentsByType(
  components: Component[]
): Map<Component['type'], number> {
  const counts = new Map<Component['type'], number>();

  components.forEach((component) => {
    counts.set(component.type, (counts.get(component.type) || 0) + 1);
  });

  return counts;
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

/**
 * Asserts that a component is a specific type, throws if not
 * Useful for scenarios where you expect a specific type
 *
 * @param component - The component to assert
 * @param type - The expected component type
 * @throws Error if component is not of the expected type
 *
 * @example
 * ```typescript
 * assertComponentType(component, 'heading');
 * // Now component is typed as HeadingComponent
 * ```
 */
export function assertComponentType<T extends Component['type']>(
  component: Component,
  type: T
): asserts component is Extract<Component, { type: T }> {
  if (component.type !== type) {
    throw new Error(
      `Expected component type ${type}, but got ${component.type}`
    );
  }
}

/**
 * Safely casts a component to a specific type with runtime check
 *
 * @param component - The component to cast
 * @param type - The target component type
 * @returns The component cast to the specified type, or null if type doesn't match
 *
 * @example
 * ```typescript
 * const heading = safeComponentCast(component, 'heading');
 * if (heading) {
 *   console.log(heading.content.level);
 * }
 * ```
 */
export function safeComponentCast<T extends Component['type']>(
  component: Component,
  type: T
): Extract<Component, { type: T }> | null {
  return component.type === type
    ? (component as Extract<Component, { type: T }>)
    : null;
}
