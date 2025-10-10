/**
 * localStorage key constants
 * Centralized storage keys to prevent typos and ensure consistency
 */

export const STORAGE_KEYS = {
  BUILDER_STATE: 'bentoblocks-builder-state',
  CONTEXT_PROMPT: 'bentoblocks-context-prompt',
  SELECTED_FONT: 'bentoblocks-selected-font',
  THEME: 'bentoblocks-theme',
} as const;

/**
 * Storage version for handling migrations
 */
export const STORAGE_VERSION = '1.0.0';
