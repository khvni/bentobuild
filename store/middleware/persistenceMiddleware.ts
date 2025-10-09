import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { saveToLocalStorage, loadFromLocalStorage, BUILDER_STATE_KEY } from '@/lib/localStorage';

/**
 * Configuration for persistence middleware
 */
export interface PersistenceConfig {
  key?: string;
  excludeKeys?: string[];
  debounceMs?: number;
}

type PersistenceMiddleware = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>,
  options?: PersistenceConfig
) => StateCreator<T & { hydrate: () => void }, Mps, Mcs>;

type PersistenceMiddlewareImpl = <T extends object>(
  config: StateCreator<T, [], []>,
  options?: PersistenceConfig
) => StateCreator<T & { hydrate: () => void }, [], []>;

/**
 * Creates a persistable version of the state
 */
function createPersistableState<T extends object>(state: T, excludeKeys: string[]): Partial<T> {
  const persistable: Partial<T> = {};
  const defaultExclude = ['hydrate', 'past', 'future', 'undo', 'redo', 'canUndo', 'canRedo', 'clearHistory'];
  const allExcludeKeys = [...defaultExclude, ...excludeKeys];

  Object.keys(state).forEach((key) => {
    if (!allExcludeKeys.includes(key) && typeof (state as any)[key] !== 'function') {
      (persistable as any)[key] = (state as any)[key];
    }
  });

  return persistable;
}

/**
 * Middleware that persists state to localStorage
 */
const persistenceMiddlewareImpl: PersistenceMiddlewareImpl = (config, options = {}) => (set, get, api) => {
  const {
    key = BUILDER_STATE_KEY,
    excludeKeys = [],
    debounceMs = 500,
  } = options;

  type TState = ReturnType<typeof config>;
  type TStateWithHydrate = TState & { hydrate: () => void };

  let saveTimeout: NodeJS.Timeout | null = null;

  // Debounced save function
  const debouncedSave = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
      const state = get() as TStateWithHydrate;
      const persistableState = createPersistableState(state, excludeKeys);
      saveToLocalStorage(key, persistableState);
    }, debounceMs);
  };

  // Initialize state with config
  const initialState = config(set, get, api);

  // Create enhanced state with hydrate function
  const stateWithHydrate: TStateWithHydrate = {
    ...initialState,

    hydrate: () => {
      const savedState = loadFromLocalStorage<Partial<TState>>(key);
      if (savedState) {
        set(savedState as Partial<TStateWithHydrate>, false);
      }
    },
  };

  // Subscribe to state changes and persist
  api.subscribe(() => {
    debouncedSave();
  });

  // Set initial state
  set(stateWithHydrate as any, true);

  return stateWithHydrate;
};

export const persistenceMiddleware = persistenceMiddlewareImpl as unknown as PersistenceMiddleware;
