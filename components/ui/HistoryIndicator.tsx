'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { History } from 'lucide-react';

/**
 * Small indicator showing undo/redo availability
 * Can be used in toolbars or status bars
 */
export function HistoryIndicator() {
  const canUndo = useBuilderStore((state) => state.canUndo);
  const canRedo = useBuilderStore((state) => state.canRedo);

  if (!canUndo && !canRedo) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <History className="h-3.5 w-3.5" />
      <span>
        {canUndo && <span className="text-blue-600">Undo</span>}
        {canUndo && canRedo && <span className="mx-1">/</span>}
        {canRedo && <span className="text-blue-600">Redo</span>}
      </span>
    </div>
  );
}
