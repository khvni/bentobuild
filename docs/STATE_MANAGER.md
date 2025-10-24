# State Manager - Undo/Redo & Persistence

This feature provides comprehensive state management with undo/redo functionality and localStorage persistence for the BentoBuild application.

## Features

- **Undo/Redo Stack**: Complete undo/redo functionality for all layout operations
- **Local Persistence**: Automatically saves state to localStorage with debouncing
- **Keyboard Shortcuts**:
  - `Ctrl+Z` / `Cmd+Z` for undo
  - `Ctrl+Y` / `Cmd+Y` or `Ctrl+Shift+Z` / `Cmd+Shift+Z` for redo
- **UI Indicators**: Visual feedback for undo/redo availability
- **State Hydration**: Automatically restores state on app load

## Architecture

### Core Components

#### 1. LocalStorage Utilities (`lib/localStorage.ts`)

Provides type-safe localStorage operations with versioning:

```typescript
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/localStorage';

// Save data
saveToLocalStorage('my-key', { foo: 'bar' });

// Load data
const data = loadFromLocalStorage<MyType>('my-key');
```

#### 2. History Middleware (`store/middleware/historyMiddleware.ts`)

Zustand middleware that adds undo/redo functionality:

- Maintains past and future state stacks
- Configurable history size (default: 50 states)
- Automatically excludes actions from history during undo/redo
- Provides `canUndo` and `canRedo` computed properties

#### 3. Persistence Middleware (`store/middleware/persistenceMiddleware.ts`)

Zustand middleware that persists state to localStorage:

- Debounced saves (default: 500ms)
- Configurable exclusion keys
- Automatic hydration on store creation
- Excludes history-related state from persistence

#### 4. useHistory Hook (`hooks/useHistory.ts`)

React hook that provides undo/redo functionality with keyboard shortcuts:

```typescript
import { useHistory } from '@/hooks/useHistory';

function MyComponent() {
  const { undo, redo, canUndo, canRedo } = useHistory();

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```

## Usage

### 1. Add StateHydrator to Your App

Add the `StateHydrator` component to your root layout to enable state restoration on load:

```tsx
import { StateHydrator } from '@/components/StateHydrator';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StateHydrator />
        {children}
      </body>
    </html>
  );
}
```

### 2. Use History Controls in Your UI

Add the pre-built history controls component:

```tsx
import { HistoryControls } from '@/components/ui/HistoryControls';

export function Toolbar() {
  return (
    <div className="toolbar">
      <HistoryControls />
      {/* other toolbar items */}
    </div>
  );
}
```

### 3. Or Use the History Hook Directly

```tsx
import { useHistory } from '@/hooks/useHistory';

export function CustomControls() {
  const { undo, redo, canUndo, canRedo } = useHistory();

  // Keyboard shortcuts are automatically enabled!

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>
        Undo (Ctrl+Z)
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo (Ctrl+Y)
      </button>
    </div>
  );
}
```

### 4. Use History Indicator for Status

Add a small indicator anywhere in your UI:

```tsx
import { HistoryIndicator } from '@/components/ui/HistoryIndicator';

export function StatusBar() {
  return (
    <div className="status-bar">
      <HistoryIndicator />
      {/* Shows "Undo" / "Redo" / "Undo / Redo" when available */}
    </div>
  );
}
```

## Configuration

### History Middleware Options

```typescript
historyMiddleware(config, {
  maxHistorySize: 50, // Maximum number of states to keep
  excludeActions: [], // Action names to exclude from history
});
```

### Persistence Middleware Options

```typescript
persistenceMiddleware(config, {
  key: 'custom-storage-key', // localStorage key
  excludeKeys: ['selectedBlockId'], // Keys to exclude from persistence
  debounceMs: 500, // Debounce delay for saves
});
```

## Store Integration

The middlewares are already integrated in `store/useBuilderStore.ts`:

```typescript
export const useBuilderStore = create<BuilderState>(
  historyMiddleware(
    persistenceMiddleware(
      (set) => ({
        // Your state and actions here
      }),
      { excludeKeys: ['selectedBlockId'] }
    ),
    { maxHistorySize: 50 }
  )
);
```

## Type Safety

All types are properly typed in `types/block.types.ts`:

```typescript
export interface BuilderState {
  // Core state
  blocks: Block[];
  contextPrompt: string;
  selectedBlockId: string | null;

  // Actions
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  setContextPrompt: (prompt: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (blocks: Block[]) => void;

  // History actions (added by middleware)
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;

  // Persistence action (added by middleware)
  hydrate: () => void;
}
```

## Best Practices

1. **Don't persist everything**: Exclude transient state like `selectedBlockId` from persistence
2. **Limit history size**: Keep maxHistorySize reasonable (50-100) to avoid memory issues
3. **Use keyboard shortcuts**: The `useHistory` hook automatically enables keyboard shortcuts
4. **Single hydration**: Only include `StateHydrator` once in your app
5. **Error handling**: LocalStorage operations include built-in error handling

## Troubleshooting

### State not persisting

- Check if localStorage is available: `isLocalStorageAvailable()`
- Check browser's localStorage quota
- Verify excludeKeys configuration

### Undo/Redo not working

- Ensure actions are using the `set` function from Zustand
- Check maxHistorySize isn't set to 0
- Verify middleware is applied in correct order

### Keyboard shortcuts conflicting

- The shortcuts only work when no input is focused
- Check for other keyboard event listeners

## Files Created

- `lib/localStorage.ts` - LocalStorage utilities
- `lib/index.ts` - Exports for lib utilities
- `hooks/useHistory.ts` - History hook with keyboard shortcuts
- `hooks/index.ts` - Exports for hooks
- `store/middleware/historyMiddleware.ts` - Undo/redo middleware
- `store/middleware/persistenceMiddleware.ts` - Persistence middleware
- `components/StateHydrator.tsx` - State hydration component
- `components/ui/HistoryControls.tsx` - Full history controls UI
- `components/ui/HistoryIndicator.tsx` - Small status indicator
- `types/block.types.ts` - Updated with history and hydration types
- `store/useBuilderStore.ts` - Updated with middleware integration

## Testing

To test the implementation:

1. **Undo/Redo**:
   - Perform actions (add/update/delete blocks)
   - Press Ctrl+Z / Cmd+Z to undo
   - Press Ctrl+Y / Cmd+Y to redo
   - Check that UI buttons are enabled/disabled correctly

2. **Persistence**:
   - Perform actions
   - Refresh the page
   - Verify state is restored

3. **Edge Cases**:
   - Try undoing with empty history
   - Try redoing with empty future
   - Perform new action after undo (should clear redo stack)
