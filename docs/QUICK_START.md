# Drag-and-Drop Quick Start Guide

## Overview

The drag-and-drop system allows users to visually build websites by dragging sections and components from a palette onto a ReactFlow canvas.

## Quick Demo

Visit the demo page to see it in action:

```bash
npm run dev
# Open: http://localhost:3000/canvas-demo
```

## Architecture Flow

```
┌─────────────────┐
│  CanvasPalette  │  Left sidebar with draggable items
└────────┬────────┘
         │
         │ User drags item
         ↓
┌─────────────────┐
│   DndContext    │  Detects drag start and end
└────────┬────────┘
         │
         │ Drop event triggered
         ↓
┌─────────────────┐
│  handleDragEnd  │  Process drop and convert coordinates
└────────┬────────┘
         │
         ├─→ Section Drop: Create at cursor position
         │   ┌─────────────────────┐
         │   │  createSection()    │
         │   │  addSection()       │
         │   └─────────────────────┘
         │
         └─→ Component Drop: Add to nearest section
             ┌─────────────────────┐
             │  Find nearest       │
             │  createComponent()  │
             │  addComponent()     │
             └─────────────────────┘
```

## Code Examples

### 1. Using the Palette

```typescript
import CanvasPalette from '@/components/canvas/CanvasPalette';

// Displays 8 section templates + 7 component templates
<CanvasPalette />
```

### 2. Using the Canvas

```typescript
import ReactFlowCanvas from '@/components/canvas/ReactFlowCanvas';

// ReactFlow canvas with drop handling built-in
<ReactFlowCanvas />
```

### 3. Complete Page Setup

```typescript
'use client';

import CanvasPalette from '@/components/canvas/CanvasPalette';
import ReactFlowCanvas from '@/components/canvas/ReactFlowCanvas';

export default function BuilderPage() {
  return (
    <div className="flex h-screen">
      <CanvasPalette />    {/* Left: Draggable items */}
      <ReactFlowCanvas />  {/* Right: Drop zone canvas */}
    </div>
  );
}
```

## Drag-and-Drop Workflow

### Step 1: Drag a Section

```typescript
// User grabs "Hero" section from palette
// Data attached: { type: 'section', variant: 'hero' }
```

### Step 2: Drop on Canvas

```typescript
// handleDragEnd in ReactFlowCanvas:
const dropPosition = screenToFlowPosition({
  x: event.clientX,
  y: event.clientY,
});

const newSection = createSection('hero', 0, dropPosition);
addSection(newSection);
```

### Step 3: State Updates

```typescript
// Zustand store updates
page.sections = [...page.sections, newSection];

// ReactFlow re-renders with new node
<SectionNode data={newSection} />
```

## Available Templates

### Sections (8 types)

- **navbar**: Top navigation bar
- **hero**: Hero/banner section
- **content**: General content section
- **features**: Features grid (3 columns)
- **gallery**: Image gallery (2 columns)
- **testimonials**: Testimonials/reviews
- **cta**: Call-to-action section
- **footer**: Footer section

### Components (7 types)

- **heading**: h1-h6 headings
- **text**: Rich text paragraphs
- **button**: CTA buttons (filled/outlined/text)
- **image**: Images with captions
- **link**: Hyperlinks
- **spacer**: Vertical spacing
- **divider**: Horizontal divider lines

## Factory Functions

All items are created using factory functions:

```typescript
import { createSection } from '@/lib/factories/sectionFactory';
import {
  createHeading,
  createText,
  createButton,
  createImage,
  createLink,
  createSpacer,
  createDivider,
} from '@/lib/factories/componentFactory';

// Section with defaults
const hero = createSection('hero', 0, { x: 100, y: 200 });

// Components with defaults
const heading = createHeading('Welcome', 1);
const text = createText('This is a paragraph');
const button = createButton('Get Started', '/signup', 'filled');
const image = createImage('https://...', 'Alt text');
```

## State Management

All changes flow through Zustand:

```typescript
import { useBuilderStore } from '@/store/useBuilderStore';

const { page, addSection, addComponent } = useBuilderStore();

// Add a section
addSection(newSection);

// Add a component to a section
addComponent(sectionId, newComponent);

// Read current state
console.log(page.sections.length);
```

## Visual Feedback

The system provides rich visual feedback:

### Cursor Changes

- **Grab cursor**: When hovering over palette items
- **Grabbing cursor**: When actively dragging
- **Default cursor**: When over drop zones

### Drag State

- **Opacity 50%**: Item being dragged
- **Scale 95%**: Item shrinks slightly
- **Smooth transitions**: All changes animated

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
if (!dragData.type) return;
```

## Styling

All styling follows the Bauhaus design system:

```css
/* Grab cursors */
.cursor-grab {
  cursor: grab;
}
.cursor-grabbing {
  cursor: grabbing;
}

/* Dragging state */
[data-dnd-dragging='true'] {
  opacity: 0.5;
  transform: scale(0.95);
}

/* Bauhaus colors */
--bauhaus-red: #e63946 --bauhaus-yellow: #f1c40f --bauhaus-blue: #2563eb;
```

## Testing

### Manual Testing Steps

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/canvas-demo`
3. Click "Instructions" button to see usage guide
4. Drag "Hero" section to canvas
5. Drag "Heading" component near section
6. Verify component appears in section
7. Drag section to move it
8. Check stats update (bottom of palette)

### Automated Testing

```typescript
describe('Drag and Drop', () => {
  it('adds section at drop position', async () => {
    render(<CanvasDemoPage />);

    const heroItem = screen.getByLabelText('Drag Hero to add to canvas');
    const canvas = screen.getByRole('region');

    await user.dragAndDrop(heroItem, canvas);

    expect(screen.getByText('1 Sections')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Problem: Component doesn't add

**Solution**: Add a section first. Components must belong to a section.

### Problem: Drop position is wrong

**Solution**: The system uses `screenToFlowPosition` to convert coordinates. Make sure ReactFlow is properly initialized.

### Problem: No visual feedback

**Solution**: Check that drag cursor styles are loaded from globals.css.

## Performance Tips

1. **Use factory functions**: Pre-defined defaults are efficient
2. **Memoize callbacks**: Event handlers use `useCallback`
3. **Minimize re-renders**: State updates are batched
4. **Efficient distance calc**: Nearest section uses optimized algorithm

## Next Steps

### Immediate Use

- Integrate into main builder page
- Add to user tutorials
- Create video walkthrough

### Future Enhancements

- Visual drop zones with highlights
- Custom drag preview overlays
- Multi-select drag operations
- Undo/redo for drag operations
- Smart auto-arrange features
- Snap-to-grid and alignment guides

## Resources

- **Full Documentation**: `docs/DRAG_AND_DROP.md`
- **Demo Page**: `app/canvas-demo/page.tsx`
- **Palette Component**: `components/canvas/CanvasPalette.tsx`
- **Canvas Component**: `components/canvas/ReactFlowCanvas.tsx`
- **Section Factory**: `lib/factories/sectionFactory.ts`
- **Component Factory**: `lib/factories/componentFactory.ts`

## Support

For questions or issues:

1. Check `docs/DRAG_AND_DROP.md` for detailed technical info
2. Review `DRAG_DROP_IMPLEMENTATION.md` for implementation details
3. See demo at `/canvas-demo` for working examples

---

**Status**: Production Ready ✅
**Last Updated**: October 23, 2025
**Version**: 1.0.0
