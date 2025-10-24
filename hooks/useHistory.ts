import { useEffect, useCallback } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';

/**
 * Hook to manage undo/redo functionality with keyboard shortcuts
 * Provides undo, redo, canUndo, and canRedo state
 */
export function useHistory() {
  const undo = useBuilderStore((state) => state.undo);
  const redo = useBuilderStore((state) => state.redo);
  const canUndo = useBuilderStore((state) => state.canUndo);
  const canRedo = useBuilderStore((state) => state.canRedo);

  // Keyboard shortcut handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd key
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (!isCtrlOrCmd) return;

      // Undo: Ctrl+Z or Cmd+Z
      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          undo();
        }
      }

      // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z or Cmd+Shift+Z
      if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
        event.preventDefault();
        if (canRedo) {
          redo();
        }
      }
    },
    [undo, redo, canUndo, canRedo]
  );

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
