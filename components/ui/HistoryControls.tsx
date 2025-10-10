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
    <div className="flex items-center gap-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`bauhaus-button px-4 py-2 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 bauhaus-transition shadow-bauhaus-sm flex items-center gap-2 ${
          canUndo
            ? 'bg-white text-black border-black hover:shadow-bauhaus-md hover:bg-gray-50 active:scale-95'
            : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
        }`}
        title={canUndo ? 'Undo (Ctrl+Z / Cmd+Z)' : 'Nothing to undo'}
        aria-label="Undo"
      >
        <Undo2 className="h-4 w-4" />
        <span className="hidden sm:inline">Undo</span>
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className={`bauhaus-button px-4 py-2 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 bauhaus-transition shadow-bauhaus-sm flex items-center gap-2 ${
          canRedo
            ? 'bg-white text-black border-black hover:shadow-bauhaus-md hover:bg-gray-50 active:scale-95'
            : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
        }`}
        title={canRedo ? 'Redo (Ctrl+Y / Cmd+Y)' : 'Nothing to redo'}
        aria-label="Redo"
      >
        <Redo2 className="h-4 w-4" />
        <span className="hidden sm:inline">Redo</span>
      </button>
    </div>
  );
}
