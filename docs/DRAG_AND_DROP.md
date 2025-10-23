# Drag-and-Drop System Documentation

**Status**: ✅ Implemented
**Version**: 1.0.0
**Last Updated**: October 23, 2025

## Overview

The Bentoblocks drag-and-drop system enables users to build websites visually by dragging sections and components from a palette onto a ReactFlow canvas. This system bridges the gap between the old block-based architecture and the new canvas-based section/component architecture.

## Architecture

### Technology Stack

- **@dnd-kit/core**: Modern drag-and-drop library for React
- **@xyflow/react**: Canvas rendering and interaction (ReactFlow)
- **Zustand**: State management for sections and components
- **TypeScript**: Type-safe implementation

### Key Components

1. **CanvasPalette** (`components/canvas/CanvasPalette.tsx`)
   - Left sidebar containing draggable section and component templates
   - Displays real-time statistics (section count, component count)
   - Uses `useDraggable` hook from @dnd-kit

2. **ReactFlowCanvas** (`components/canvas/ReactFlowCanvas.tsx`)
   - Main canvas area powered by ReactFlow
   - Wraps canvas in `DndContext` for drop handling
   - Converts mouse coordinates to canvas coordinates using `screenToFlowPosition`

3. **Zustand Store** (`store/useBuilderStore.ts`)
   - Manages page state with sections and components
   - Provides actions: `addSection`, `addComponent`, `updateSection`, etc.

## How It Works

### 1. Drag Initiation

When a user grabs an item from the palette:

```typescript
// CanvasPalette.tsx
const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
  id: `section-${template.variant}`,
  data: {
    type: 'section',
    variant: template.variant,
  },
});
```

The `data` object contains:
- **For sections**: `{ type: 'section', variant: SectionVariant }`
- **For components**: `{ type: 'component', componentType: ComponentType }`

### 2. Drop Detection

When the user releases the item over the canvas:

```typescript
// ReactFlowCanvas.tsx
const handleDragEnd = (event: DragEndEvent) => {
  const { active } = event;
  const dragData = active.data.current;

  // Convert mouse position to canvas coordinates
  const dropPosition = screenToFlowPosition({
    x: event.activatorEvent?.clientX || 0,
    y: event.activatorEvent?.clientY || 0,
  });

  // Handle section or component drop
  if (dragData.type === 'section') {
    // Create and add section
  } else if (dragData.type === 'component') {
    // Find nearest section and add component
  }
};
```

### 3. Section Creation

Sections are created at the exact drop position:

```typescript
if (dragData.type === 'section') {
  const sectionCount = page?.sections.length || 0;
  const newSection = createSection(
    dragData.variant,
    sectionCount,
    dropPosition
  );
  addSection(newSection);
}
```

The `createSection` factory function:
- Generates a unique ID using `uuid()`
- Sets position to drop coordinates
- Applies variant-specific layout defaults
- Initializes with empty children array

### 4. Component Creation

Components are added to the nearest section:

```typescript
if (dragData.type === 'component') {
  // Check if any sections exist
  if (!page || page.sections.length === 0) {
    alert('Please add a section first before adding components');
    return;
  }

  // Find closest section using Euclidean distance
  const targetSection = page.sections.reduce((closest, section) => {
    const distance = Math.sqrt(
      Math.pow(section.position.x - dropPosition.x, 2) +
      Math.pow(section.position.y - dropPosition.y, 2)
    );
    if (!closest || distance < closest.distance) {
      return { section, distance };
    }
    return closest;
  }, null);

  // Create component and add to section
  const component = createComponentByType(dragData.componentType);
  addComponent(targetSection.section.id, component);
}
```

### 5. State Synchronization

Changes flow through Zustand:

```
Palette → DragEnd Handler → Zustand Action → Page State Update → ReactFlow Re-render
```

ReactFlow nodes are derived from the page state:

```typescript
useEffect(() => {
  if (!page) return;

  const reactFlowNodes: Node[] = page.sections.map((section) => ({
    id: section.id,
    type: 'section',
    position: section.position,
    data: section as unknown as Record<string, unknown>,
  }));

  setNodes(reactFlowNodes);
}, [page]);
```

## Component Factories

### Section Factory

Creates sections with sensible defaults based on variant:

```typescript
import { createSection } from '@/lib/factories/sectionFactory';

const heroSection = createSection('hero', 0, { x: 100, y: 200 });
// Returns:
// {
//   id: 'uuid',
//   type: 'section',
//   variant: 'hero',
//   order: 0,
//   position: { x: 100, y: 200 },
//   layout: { type: 'stack', direction: 'vertical', align: 'center', ... },
//   style: { backgroundColor: '#F9FAFB', textColor: '#111827' },
//   children: []
// }
```

### Component Factory

Creates components with type-specific defaults:

```typescript
import {
  createHeading,
  createText,
  createButton,
  createImage
} from '@/lib/factories/componentFactory';

const heading = createHeading('Welcome', 1);
const text = createText('This is a paragraph');
const button = createButton('Click Me', '/page', 'filled');
const image = createImage('https://...', 'Alt text');
```

## Drop Position Algorithm

### Mouse to Canvas Coordinates

ReactFlow's `screenToFlowPosition` converts screen coordinates to canvas space:

```typescript
const { screenToFlowPosition } = useReactFlow();

const canvasPos = screenToFlowPosition({
  x: event.clientX,  // Browser viewport X
  y: event.clientY,  // Browser viewport Y
});
// Returns: { x: canvasX, y: canvasY } accounting for zoom and pan
```

### Nearest Section Algorithm

For component drops, we use Euclidean distance:

```typescript
function findNearestSection(sections: Section[], dropPos: Position): Section | null {
  let nearest = null;
  let minDistance = Infinity;

  for (const section of sections) {
    const distance = Math.sqrt(
      Math.pow(section.position.x - dropPos.x, 2) +
      Math.pow(section.position.y - dropPos.y, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = section;
    }
  }

  return nearest;
}
```

## DndContext Configuration

The canvas uses @dnd-kit's collision detection:

```typescript
<DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  {/* Canvas content */}
</DndContext>
```

**Collision Detection Options**:
- `closestCenter`: Default, based on center point
- `closestCorners`: Based on corners
- `rectIntersection`: Based on bounding box overlap
- `pointerWithin`: Based on pointer position

We use `closestCenter` for consistent drop behavior.

## Visual Feedback

### Drag State

Items show visual feedback during drag:

```css
.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

/* Applied during drag */
.isDragging {
  opacity: 0.5;
  transform: scale(0.95);
}
```

### Palette Items

```typescript
<button
  className={`
    cursor-grab active:cursor-grabbing
    shadow-bauhaus-sm hover:shadow-bauhaus-md
    ${isDragging ? 'opacity-50 scale-95' : ''}
  `}
>
  {/* Item content */}
</button>
```

## Error Handling

### Component Without Section

```typescript
if (!page || page.sections.length === 0) {
  alert('Please add a section first before adding components');
  return;
}
```

### Invalid Drop Data

```typescript
if (!active.data.current) return;

const dragData = active.data.current;
if (!dragData.type) return; // Invalid data
```

## Best Practices

### 1. Always Check Section Existence

Before adding components:

```typescript
if (page && page.sections.length > 0) {
  // Safe to add component
}
```

### 2. Use Factory Functions

Never manually construct sections/components:

```typescript
// ✅ Good
const section = createSection('hero', 0);

// ❌ Bad
const section = {
  id: uuid(),
  type: 'section',
  // ... manual construction
};
```

### 3. Sync State Properly

Always use Zustand actions:

```typescript
// ✅ Good
addSection(newSection);

// ❌ Bad
page.sections.push(newSection); // Direct mutation
```

### 4. Handle Edge Cases

```typescript
// Check for null/undefined
if (!page) return;

// Provide fallbacks
const dropPosition = screenToFlowPosition({
  x: event.activatorEvent?.clientX || 0,
  y: event.activatorEvent?.clientY || 0,
});
```

## Usage Example

### Basic Setup

```typescript
'use client';

import CanvasPalette from '@/components/canvas/CanvasPalette';
import ReactFlowCanvas from '@/components/canvas/ReactFlowCanvas';

export default function BuilderPage() {
  return (
    <div className="flex h-screen">
      <CanvasPalette />
      <ReactFlowCanvas />
    </div>
  );
}
```

### With Instructions Panel

See `/app/canvas-demo/page.tsx` for a complete example with:
- Instructions toggle
- Usage tips
- Visual feedback
- Bauhaus styling

## Testing

### Manual Testing Checklist

1. **Section Drop**
   - [ ] Drag section from palette
   - [ ] Drop on empty canvas
   - [ ] Section appears at cursor position
   - [ ] Section displays in ReactFlow

2. **Component Drop**
   - [ ] Try dropping component on empty canvas → shows alert
   - [ ] Add a section first
   - [ ] Drop component near section → adds to section
   - [ ] Component appears in section node

3. **Multiple Sections**
   - [ ] Add multiple sections
   - [ ] Drop component between sections
   - [ ] Component goes to nearest section

4. **Canvas Interaction**
   - [ ] Pan canvas (drag background)
   - [ ] Zoom in/out (controls or mouse wheel)
   - [ ] Move sections (drag section nodes)
   - [ ] Position updates persist

5. **Visual Feedback**
   - [ ] Grab cursor on hover
   - [ ] Grabbing cursor during drag
   - [ ] Item opacity reduces during drag
   - [ ] Stats update after drop

### Automated Testing

```typescript
// Test drag-and-drop flow
describe('Canvas Drag and Drop', () => {
  it('should add section at drop position', async () => {
    const user = userEvent.setup();
    render(<CanvasDemoPage />);

    const heroItem = screen.getByLabelText('Drag Hero to add to canvas');
    const canvas = screen.getByRole('region', { name: 'canvas' });

    await user.pointer([
      { keys: '[MouseLeft>]', target: heroItem },
      { coords: { x: 400, y: 300 } },
      { keys: '[/MouseLeft]' },
    ]);

    expect(screen.getByText('1 Sections')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Issue: Component doesn't add to section

**Cause**: No sections on canvas
**Solution**: Add a section first, or improve UX to automatically create a section

### Issue: Drop position is wrong

**Cause**: Not using `screenToFlowPosition`
**Solution**: Always convert mouse coordinates to canvas coordinates

### Issue: State not updating

**Cause**: Direct mutation instead of Zustand actions
**Solution**: Use `addSection`, `addComponent`, etc.

### Issue: Drag doesn't work

**Cause**: Missing `DndContext` wrapper
**Solution**: Ensure canvas is wrapped in `DndContext`

## Performance Considerations

### Optimizations

1. **Memoize callbacks**: Use `useCallback` for event handlers
2. **Minimize re-renders**: ReactFlow nodes only update when page state changes
3. **Efficient distance calculation**: Early exit when closest section found
4. **Factory functions**: Pre-defined defaults avoid repeated object creation

### Potential Bottlenecks

- Large number of sections (>50): Consider virtualization
- Complex component trees: Optimize SectionNode rendering
- Frequent state updates: Batch updates when possible

## Future Enhancements

### Planned Features

1. **Visual Drop Zones**
   - Show highlighted drop zones for components
   - Preview component position before drop

2. **Drag Preview**
   - Custom drag overlay showing section/component preview
   - Snap-to-grid indicator

3. **Multi-Select Drag**
   - Drag multiple sections at once
   - Bulk operations

4. **Undo/Redo**
   - Track drag-and-drop operations in history
   - Keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)

5. **Smart Positioning**
   - Auto-arrange sections in vertical stack
   - Prevent overlapping sections
   - Magnetic snap to alignment guides

## Related Documentation

- [ReactFlow Setup](./REACTFLOW_SETUP.md)
- [Section Node](./SECTION_NODE.md)
- [Component Node](./COMPONENT_NODE.md)
- [State Manager](./STATE_MANAGER.md)

## API Reference

### CanvasPalette Component

```typescript
export default function CanvasPalette(): JSX.Element
```

**Props**: None
**Returns**: Palette UI with draggable sections and components

### ReactFlowCanvas Component

```typescript
export default function ReactFlowCanvas(): JSX.Element
```

**Props**: None
**Returns**: Canvas with drop handling

### Zustand Actions

```typescript
// Add section
addSection(section: Section): void

// Add component to section
addComponent(sectionId: string, component: Component): void

// Update section properties
updateSection(sectionId: string, updates: Partial<Section>): void

// Delete section
deleteSection(sectionId: string): void
```

## Conclusion

The drag-and-drop system provides an intuitive way for users to build websites visually. By combining @dnd-kit's robust drag handling with ReactFlow's canvas rendering and Zustand's state management, we achieve a performant and maintainable implementation.

For questions or contributions, see the main [CLAUDE.md](../CLAUDE.md) documentation.
