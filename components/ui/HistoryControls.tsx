'use client';

import { useHistory } from '@/hooks/useHistory';
import { Undo2, Redo2 } from 'lucide-react';

/**
 * UI component for undo/redo controls
 * Shows buttons with enabled/disabled states and tooltips
 */
export function HistoryControls() {
  const { undo, redo, canUndo, canRedo } = useHistory();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`
          flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors
          ${
            canUndo
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'cursor-not-allowed text-gray-300'
          }
        `}
        title={canUndo ? 'Undo (Ctrl+Z / Cmd+Z)' : 'Nothing to undo'}
        aria-label="Undo"
      >
        <Undo2 className="h-4 w-4" />
        <span className="hidden sm:inline">Undo</span>
      </button>

      <div className="h-6 w-px bg-gray-200" />

      <button
        onClick={redo}
        disabled={!canRedo}
        className={`
          flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors
          ${
            canRedo
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'cursor-not-allowed text-gray-300'
          }
        `}
        title={canRedo ? 'Redo (Ctrl+Y / Cmd+Y)' : 'Nothing to redo'}
        aria-label="Redo"
      >
        <Redo2 className="h-4 w-4" />
        <span className="hidden sm:inline">Redo</span>
      </button>
    </div>
  );
}
