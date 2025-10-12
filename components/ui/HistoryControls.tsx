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
        className={`bauhaus-button px-6 py-3 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 bauhaus-transition flex items-center gap-2 ${
          canUndo
            ? 'bg-blue-600 text-white border-black shadow-bauhaus-md hover:shadow-bauhaus-lg hover:bg-blue-700 active:scale-95'
            : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
        }`}
        title={canUndo ? 'Undo (Ctrl+Z / Cmd+Z)' : 'Nothing to undo'}
        aria-label="Undo"
      >
        <Undo2 className="h-5 w-5" />
        <span className="hidden sm:inline">Undo</span>
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className={`bauhaus-button px-6 py-3 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 bauhaus-transition flex items-center gap-2 ${
          canRedo
            ? 'bg-blue-600 text-white border-black shadow-bauhaus-md hover:shadow-bauhaus-lg hover:bg-blue-700 active:scale-95'
            : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
        }`}
        title={canRedo ? 'Redo (Ctrl+Y / Cmd+Y)' : 'Nothing to redo'}
        aria-label="Redo"
      >
        <Redo2 className="h-5 w-5" />
        <span className="hidden sm:inline">Redo</span>
      </button>
    </div>
  );
}
