/**
 * Keyboard shortcut constants
 * Centralized keyboard shortcuts for consistency and documentation
 */

export const KEYBOARD_SHORTCUTS = {
  UNDO: { key: 'z', meta: true },
  REDO: { key: 'z', meta: true, shift: true },
  DELETE: { key: 'Delete' },
  BACKSPACE: { key: 'Backspace' },
  DUPLICATE: { key: 'd', meta: true },
  SAVE: { key: 's', meta: true },
  ESCAPE: { key: 'Escape' },
} as const;

/**
 * Keyboard key codes
 */
export const KEY_CODES = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
} as const;

/**
 * Modifier keys
 */
export const MODIFIER_KEYS = {
  META: 'metaKey',  // Cmd on Mac, Win on Windows
  CTRL: 'ctrlKey',
  ALT: 'altKey',
  SHIFT: 'shiftKey',
} as const;
