/**
 * Store Types for Canvas Architecture
 *
 * Type definitions for the Zustand store managing the new Page/Section/Component architecture.
 *
 * @module types/store.types
 */

import {
  Page,
  Section,
  Component,
  SectionVariant,
  ComponentType,
  StyleConfig,
  LayoutConfig,
} from '@/types/canvas.types';

// ============================================================================
// STORE STATE
// ============================================================================

/**
 * The main builder store state
 * Manages the entire page structure and editor state
 */
export interface BuilderStore {
  // ============================================================================
  // STATE
  // ============================================================================

  /** The current page being edited */
  page: Page;

  /** Context prompt for AI generation */
  contextPrompt: string;

  /** Currently selected section ID (null if none selected) */
  selectedSectionId: string | null;

  /** Currently selected component ID (null if none selected) */
  selectedComponentId: string | null;

  /** Undo history stack */
  history: Page[];

  /** Current position in history (for undo/redo) */
  historyIndex: number;

  /** Maximum history size */
  maxHistorySize: number;

  /** Loading state for async operations */
  isLoading: boolean;

  /** Error message (null if no error) */
  error: string | null;

  // ============================================================================
  // PAGE ACTIONS
  // ============================================================================

  /**
   * Initializes a new page with default structure
   * @param metadata - Optional page metadata
   */
  initializePage: (metadata?: { title?: string; description?: string }) => void;

  /**
   * Loads a page from storage or API
   * @param page - The page to load
   */
  loadPage: (page: Page) => void;

  /**
   * Updates page metadata
   * @param metadata - Partial metadata to update
   */
  updatePageMetadata: (
    metadata: Partial<{ title: string; description: string; favicon: string }>
  ) => void;

  /**
   * Updates viewport state (zoom and pan)
   * @param viewport - Partial viewport to update
   */
  updateViewport: (viewport: Partial<{ zoom: number; x: number; y: number }>) => void;

  /**
   * Resets the page to default state
   */
  resetPage: () => void;

  // ============================================================================
  // SECTION ACTIONS
  // ============================================================================

  /**
   * Adds a new section to the page
   * @param variant - The section variant to add
   * @param position - Optional position to insert at (defaults to end)
   */
  addSection: (variant: SectionVariant, position?: number) => void;

  /**
   * Removes a section by ID
   * @param sectionId - The section ID to remove
   */
  removeSection: (sectionId: string) => void;

  /**
   * Updates a section's properties
   * @param sectionId - The section ID to update
   * @param updates - Partial section properties to update
   */
  updateSection: (
    sectionId: string,
    updates: Partial<Omit<Section, 'id' | 'type' | 'children'>>
  ) => void;

  /**
   * Updates a section's layout configuration
   * @param sectionId - The section ID to update
   * @param layout - Partial layout configuration to update
   */
  updateSectionLayout: (sectionId: string, layout: Partial<LayoutConfig>) => void;

  /**
   * Updates a section's style configuration
   * @param sectionId - The section ID to update
   * @param style - Partial style configuration to update
   */
  updateSectionStyle: (sectionId: string, style: Partial<StyleConfig>) => void;

  /**
   * Reorders sections
   * @param sections - Array of sections in new order
   */
  reorderSections: (sections: Section[]) => void;

  /**
   * Duplicates a section
   * @param sectionId - The section ID to duplicate
   */
  duplicateSection: (sectionId: string) => void;

  /**
   * Selects a section
   * @param sectionId - The section ID to select (null to deselect)
   */
  selectSection: (sectionId: string | null) => void;

  // ============================================================================
  // COMPONENT ACTIONS
  // ============================================================================

  /**
   * Adds a component to a section
   * @param sectionId - The section to add the component to
   * @param component - The component to add
   */
  addComponent: (sectionId: string, component: Component) => void;

  /**
   * Removes a component by ID
   * @param sectionId - The section containing the component
   * @param componentId - The component ID to remove
   */
  removeComponent: (sectionId: string, componentId: string) => void;

  /**
   * Updates a component's properties
   * @param sectionId - The section containing the component
   * @param componentId - The component ID to update
   * @param updates - Partial component properties to update
   */
  updateComponent: (
    sectionId: string,
    componentId: string,
    updates: Partial<Omit<Component, 'id' | 'type'>>
  ) => void;

  /**
   * Updates a component's content
   * @param sectionId - The section containing the component
   * @param componentId - The component ID to update
   * @param content - Partial content to update
   */
  updateComponentContent: (
    sectionId: string,
    componentId: string,
    content: Record<string, unknown>
  ) => void;

  /**
   * Updates a component's style
   * @param sectionId - The section containing the component
   * @param componentId - The component ID to update
   * @param style - Partial style configuration to update
   */
  updateComponentStyle: (
    sectionId: string,
    componentId: string,
    style: Partial<StyleConfig>
  ) => void;

  /**
   * Reorders components within a section
   * @param sectionId - The section containing the components
   * @param components - Array of components in new order
   */
  reorderComponents: (sectionId: string, components: Component[]) => void;

  /**
   * Duplicates a component within its section
   * @param sectionId - The section containing the component
   * @param componentId - The component ID to duplicate
   */
  duplicateComponent: (sectionId: string, componentId: string) => void;

  /**
   * Selects a component
   * @param componentId - The component ID to select (null to deselect)
   */
  selectComponent: (componentId: string | null) => void;

  // ============================================================================
  // CONTEXT ACTIONS
  // ============================================================================

  /**
   * Sets the context prompt for AI generation
   * @param prompt - The new context prompt
   */
  setContextPrompt: (prompt: string) => void;

  // ============================================================================
  // HISTORY ACTIONS
  // ============================================================================

  /**
   * Undo the last change
   */
  undo: () => void;

  /**
   * Redo the last undone change
   */
  redo: () => void;

  /**
   * Check if undo is available
   */
  canUndo: () => boolean;

  /**
   * Check if redo is available
   */
  canRedo: () => boolean;

  /**
   * Clears the history
   */
  clearHistory: () => void;

  // ============================================================================
  // UI STATE ACTIONS
  // ============================================================================

  /**
   * Sets loading state
   * @param isLoading - Loading state
   */
  setLoading: (isLoading: boolean) => void;

  /**
   * Sets error state
   * @param error - Error message (null to clear)
   */
  setError: (error: string | null) => void;

  /**
   * Clears error state
   */
  clearError: () => void;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Type for component update payloads
 */
export type ComponentUpdate = Partial<Omit<Component, 'id' | 'type'>>;

/**
 * Type for section update payloads
 */
export type SectionUpdate = Partial<Omit<Section, 'id' | 'type' | 'children'>>;

/**
 * Type for store action functions only (no state)
 */
export type BuilderActions = Omit<
  BuilderStore,
  | 'page'
  | 'contextPrompt'
  | 'selectedSectionId'
  | 'selectedComponentId'
  | 'history'
  | 'historyIndex'
  | 'maxHistorySize'
  | 'isLoading'
  | 'error'
>;

/**
 * Type for store state only (no actions)
 */
export type BuilderState = Pick<
  BuilderStore,
  | 'page'
  | 'contextPrompt'
  | 'selectedSectionId'
  | 'selectedComponentId'
  | 'history'
  | 'historyIndex'
  | 'maxHistorySize'
  | 'isLoading'
  | 'error'
>;

// ============================================================================
// SELECTOR HELPERS
// ============================================================================

/**
 * Selectors for derived state
 * These can be used to compute values from the store state
 */
export interface BuilderSelectors {
  /**
   * Gets the currently selected section
   */
  getSelectedSection: () => Section | null;

  /**
   * Gets the currently selected component and its parent section
   */
  getSelectedComponent: () => { section: Section; component: Component } | null;

  /**
   * Gets a section by ID
   */
  getSectionById: (sectionId: string) => Section | null;

  /**
   * Gets a component by ID (searches all sections)
   */
  getComponentById: (componentId: string) => { section: Section; component: Component } | null;

  /**
   * Gets all sections sorted by order
   */
  getSortedSections: () => Section[];

  /**
   * Checks if page has unsaved changes (by comparing to initial state)
   */
  hasUnsavedChanges: () => boolean;
}

// ============================================================================
// PERSISTENCE TYPES
// ============================================================================

/**
 * Serialized state for localStorage persistence
 */
export interface PersistedState {
  page: Page;
  contextPrompt: string;
  version: string; // For migration compatibility
  timestamp: number; // When state was saved
}

/**
 * Options for state persistence
 */
export interface PersistenceOptions {
  /** Storage key in localStorage */
  key: string;

  /** Whether to enable auto-save */
  autoSave: boolean;

  /** Auto-save debounce delay in milliseconds */
  debounceMs: number;

  /** Version for migration tracking */
  version: string;
}
