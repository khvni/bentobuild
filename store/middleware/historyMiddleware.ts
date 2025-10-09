import { StateCreator, StoreMutatorIdentifier } from 'zustand';

/**
 * History state interface for undo/redo functionality
 */
export interface HistoryState<T> {
  past: T[];
  future: T[];
}

/**
 * Actions for history management
 */
export interface HistoryActions {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

/**
 * Configuration for history middleware
 */
export interface HistoryConfig {
  maxHistorySize?: number;
  excludeActions?: string[];
}

type HistoryMiddleware = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>,
  options?: HistoryConfig
) => StateCreator<T & HistoryActions, Mps, Mcs>;

type HistoryMiddlewareImpl = <T extends object>(
  config: StateCreator<T, [], []>,
  options?: HistoryConfig
) => StateCreator<T & HistoryActions, [], []>;

/**
 * Creates a snapshot of the current state, excluding history-related fields
 */
function createSnapshot<T extends object>(state: T): Partial<T> {
  if (!state || typeof state !== 'object') {
    return {};
  }

  const snapshot: Partial<T> = {};
  const excludeKeys = ['past', 'future', 'undo', 'redo', 'canUndo', 'canRedo', 'clearHistory'];

  Object.keys(state).forEach((key) => {
    if (!excludeKeys.includes(key) && typeof (state as any)[key] !== 'function') {
      (snapshot as any)[key] = (state as any)[key];
    }
  });

  return snapshot;
}

/**
 * Middleware that adds undo/redo functionality to Zustand store
 */
const historyMiddlewareImpl: HistoryMiddlewareImpl = (config, options = {}) => (set, get, api) => {
  const { maxHistorySize = 50, excludeActions = [] } = options;

  type TState = ReturnType<typeof config>;
  type TStateWithHistory = TState & HistoryActions & { past: Partial<TState>[]; future: Partial<TState>[] };

  // Track if we're in an undo/redo operation to prevent adding to history
  let isUndoRedo = false;

  // Track initialization
  let isInitialized = false;

  // Initialize with history state
  const initialState = config(
    (partial, replace?) => {
      // Only add to history if initialized and not during undo/redo
      if (isInitialized && !isUndoRedo) {
        const currentState = get() as TStateWithHistory;

        // Check if past/future exist before using them
        if (currentState && typeof currentState === 'object' && 'past' in currentState) {
          const snapshot = createSnapshot(currentState);

          // Add current state to past
          const newPast = [...(currentState.past || []), snapshot];

          // Limit history size
          const past = newPast.slice(-maxHistorySize);

          // Clear future on new action
          set({ past, future: [] } as Partial<TStateWithHistory>, false);
        }
      }

      if (replace === true) {
        set(partial as any, true);
      } else {
        set(partial as any, false);
      }
    },
    get,
    api
  );

  // Create the enhanced state with history actions
  const stateWithHistory: TStateWithHistory = {
    ...initialState,
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    undo: () => {
      const state = get() as TStateWithHistory;
      if (state.past.length === 0) return;

      isUndoRedo = true;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      const currentSnapshot = createSnapshot(state);

      set(
        {
          ...previous,
          past: newPast,
          future: [currentSnapshot, ...state.future],
          canUndo: newPast.length > 0,
          canRedo: true,
        } as any,
        true
      );

      isUndoRedo = false;
    },

    redo: () => {
      const state = get() as TStateWithHistory;
      if (state.future.length === 0) return;

      isUndoRedo = true;

      const next = state.future[0];
      const newFuture = state.future.slice(1);
      const currentSnapshot = createSnapshot(state);

      set(
        {
          ...next,
          past: [...state.past, currentSnapshot],
          future: newFuture,
          canUndo: true,
          canRedo: newFuture.length > 0,
        } as any,
        true
      );

      isUndoRedo = false;
    },

    clearHistory: () => {
      set(
        {
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<TStateWithHistory>,
        false
      );
    },
  };

  // Subscribe to state changes to update canUndo/canRedo
  api.subscribe((state) => {
    const historyState = state as TStateWithHistory;
    const canUndo = historyState.past.length > 0;
    const canRedo = historyState.future.length > 0;

    if (historyState.canUndo !== canUndo || historyState.canRedo !== canRedo) {
      set({ canUndo, canRedo } as Partial<TStateWithHistory>, false);
    }
  });

  // Set initial state
  set(stateWithHistory as any, true);

  // Mark as initialized after setting initial state
  isInitialized = true;

  return stateWithHistory;
};

export const historyMiddleware = historyMiddlewareImpl as unknown as HistoryMiddleware;
