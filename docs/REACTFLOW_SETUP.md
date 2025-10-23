# ReactFlow Canvas Setup - Group 2 Agent 1

## Overview

This document describes the ReactFlow foundation that has been set up for the Bentoblocks Framer-style visual editor. ReactFlow provides the interactive canvas infrastructure for drag-and-drop section and component editing.

## What Was Built

### 1. Dependencies Installed

- **@xyflow/react** (latest version): Modern React Flow library for building node-based interfaces

### 2. Core Files Created

#### `/components/canvas/ReactFlowCanvas.tsx`
The main ReactFlow canvas component that will serve as the visual editing surface.

**Features:**
- Pan and zoom controls
- Grid/dot background
- Snap-to-grid enabled (20px grid)
- Custom node types for sections and components
- Viewport management (min zoom: 0.2, max zoom: 1.5)
- Bauhaus-themed styling integration

**Current Node Types:**
- `section`: Displays section information (variant, order, child count)
- `component`: Displays component type

**Usage:**
```typescript
import ReactFlowCanvas from '@/components/canvas/ReactFlowCanvas';

function MyPage() {
  return <ReactFlowCanvas />;
}
```

#### `/lib/canvas/canvasUtils.ts`
Utility functions for converting between Bentoblocks data structures and ReactFlow nodes.

**Functions:**

1. **`pageToReactFlow(page: Page)`**
   - Converts Page structure to ReactFlow nodes and edges
   - Creates section nodes and component child nodes
   - Sets up parent-child relationships using `parentId`

2. **`reactFlowToPage(nodes: Node[], currentPage: Page)`**
   - Converts ReactFlow nodes back to Page structure
   - Preserves position changes from drag-and-drop
   - Maintains section order

3. **`calculateSectionPositions(sections: Section[])`**
   - Auto-calculates section positions based on order
   - Uses 450px vertical spacing between sections

4. **`getViewportBounds(sections: Section[])`**
   - Calculates viewport bounds for fitting all sections
   - Useful for auto-fit functionality

#### `/store/useBuilderStore.ts` (Updated)
Extended Zustand store with new Page-based architecture actions.

**New State:**
- `page: Page | null` - Current page data

**New Actions:**
- `setPage(page: Page)` - Set entire page
- `addSection(section: Section)` - Add section to page
- `updateSection(id, updates)` - Update section properties
- `deleteSection(id)` - Remove section
- `addComponent(sectionId, component)` - Add component to section
- `updateComponent(sectionId, componentId, updates)` - Update component
- `deleteComponent(sectionId, componentId)` - Remove component

**Example:**
```typescript
const { addSection, page } = useBuilderStore();

const heroSection = createSection('hero', 0);
addSection(heroSection);
```

#### `/app/globals.css` (Updated)
Added Bauhaus-themed ReactFlow custom styles.

**Styling:**
- Selected nodes show yellow ring (`#EAB308`)
- Controls have geometric shadows
- Buttons have hover states with yellow background
- Edges use black stroke with yellow selection
- Attribution hidden

#### `/app/canvas-test/page.tsx`
Test page demonstrating ReactFlow integration.

**Features:**
- Creates sample sections (hero and content)
- Adds components to sections
- Displays ReactFlow canvas
- Shows how to integrate with Zustand store

**Access:** Navigate to `/canvas-test` to view the test page

### 3. Type System Integration

Updated `/types/block.types.ts` to include:
- Imported Page, Section, Component types from canvas.types
- Extended BuilderState interface with page-based actions
- Maintained backward compatibility with existing Block types

## Architecture

### Data Flow

```
User Action → ReactFlow → Node Changes → Zustand Store → Page Structure
                ↑                                               ↓
                └───────────── Sync Back ──────────────────────┘
```

### Node Structure

**Section Nodes:**
```typescript
{
  id: section.id,
  type: 'section',
  position: { x: 100, y: 100 },
  data: section,  // Complete Section object
  draggable: true,
  selectable: true
}
```

**Component Nodes:**
```typescript
{
  id: component.id,
  type: 'component',
  position: { x: 0, y: 0 },
  data: component,  // Complete Component object
  parentId: sectionId,  // Parent section ID
  extent: 'parent',  // Constrained to parent bounds
  draggable: true,
  selectable: true
}
```

## Testing

### Manual Testing Checklist

1. **Navigate to `/canvas-test`**
   ```bash
   npm run dev
   # Open http://localhost:3000/canvas-test
   ```

2. **Verify Canvas Renders**
   - Canvas should display with dot grid background
   - Controls should be visible in bottom-left
   - Panel should show "Canvas" and node count in top-left

3. **Test Pan and Zoom**
   - Use mouse wheel to zoom in/out
   - Click and drag canvas background to pan
   - Verify zoom limits (0.2x - 1.5x)

4. **Test Controls**
   - Click zoom in (+) button
   - Click zoom out (-) button
   - Click fit view button
   - Click lock/unlock button

5. **Verify Node Display**
   - Section nodes should appear (if test data is present)
   - Nodes should show section variant and component count

### Type Safety

TypeScript compilation passes:
```bash
npm run type-check
# ✓ No errors
```

## Integration Points for Other Agents

### Group 2 Agent 2: Custom Node Components
**What to build:**
- Replace placeholder node renderers in `nodeTypes` object
- Create `SectionNode.tsx` with full section rendering
- Create `ComponentNode.tsx` with component-specific rendering
- Add resize handles, delete buttons, and inline editing

**Where to integrate:**
```typescript
// In ReactFlowCanvas.tsx
import SectionNode from './nodes/SectionNode';
import ComponentNode from './nodes/ComponentNode';

const nodeTypes = {
  section: SectionNode,
  component: ComponentNode,
};
```

### Group 2 Agent 3: Drag-and-Drop Integration
**What to build:**
- Connect BlockPalette to ReactFlow drop zone
- Handle dropping sections onto canvas
- Handle dropping components into sections
- Update positions in Zustand store

**Where to integrate:**
- Use `pageToReactFlow()` to convert store data to nodes
- Listen to ReactFlow `onNodesChange` to update positions
- Use `reactFlowToPage()` to save changes back to store

### Group 2 Agent 4: Selection and Editing
**What to build:**
- Handle node selection events
- Open BlockEditor panel when node selected
- Sync selected node with `selectedBlockId` in store
- Implement multi-select and group operations

## Usage Examples

### Creating and Displaying Sections

```typescript
'use client';

import { useEffect } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { createSection } from '@/lib/factories/sectionFactory';
import { createHeading, createButton } from '@/lib/factories/componentFactory';
import ReactFlowCanvas from '@/components/canvas/ReactFlowCanvas';

export default function EditorPage() {
  const { addSection, page } = useBuilderStore();

  useEffect(() => {
    if (!page) {
      // Create initial sections
      const hero = createSection('hero', 0);
      hero.children = [
        createHeading('Welcome', 1),
        createButton('Get Started', '/start', 'filled'),
      ];
      addSection(hero);

      const content = createSection('content', 1);
      content.children = [
        createHeading('About Us', 2),
      ];
      addSection(content);
    }
  }, [addSection, page]);

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-white border-b-4 border-black">
        <h1>Bentoblocks Editor</h1>
      </header>
      <ReactFlowCanvas />
    </div>
  );
}
```

### Converting Between Data Formats

```typescript
import { pageToReactFlow, reactFlowToPage } from '@/lib/canvas/canvasUtils';

// Convert page to nodes for ReactFlow
const { nodes, edges } = pageToReactFlow(page);

// Update ReactFlow
setNodes(nodes);
setEdges(edges);

// After user drags nodes, convert back
const updatedPage = reactFlowToPage(nodes, page);
setPage(updatedPage);
```

## Current Limitations

1. **Placeholder Node Renderers**: Current node components are minimal placeholders. Need custom components with full rendering.

2. **No Store Sync**: ReactFlow nodes are not yet synced with Zustand store. Need bidirectional sync.

3. **No Drag-from-Palette**: Can't drag sections/components from BlockPalette yet. Need drop zone handlers.

4. **No Selection Integration**: Selecting nodes doesn't update `selectedBlockId` in store yet.

5. **Static Test Data**: Canvas only displays test data created on mount. Need dynamic updates.

## Next Steps

1. **Group 2 Agent 2**: Build custom SectionNode and ComponentNode components
2. **Group 2 Agent 3**: Implement drag-and-drop from palette
3. **Group 2 Agent 4**: Add selection handling and BlockEditor integration
4. **Group 2 Agent 5**: Implement keyboard shortcuts and canvas operations

## Development Notes

### Key Design Decisions

1. **Used `parentId` instead of `parentNode`**: ReactFlow v12+ uses `parentId` for parent-child relationships

2. **Double Type Assertion**: Used `as unknown as Record<string, unknown>` to satisfy TypeScript for node data types

3. **Preserved Existing Store**: Added new page-based actions alongside existing block actions for backward compatibility

4. **Bauhaus Styling**: Integrated ReactFlow controls and nodes with existing Bauhaus design system

### Important Files to Review

- `/types/canvas.types.ts` - Complete type system for sections and components
- `/lib/factories/sectionFactory.ts` - Factory functions for creating sections
- `/lib/factories/componentFactory.ts` - Factory functions for creating components

## Troubleshooting

### "ReactFlow is not a valid JSX component"
**Solution:** Import ReactFlow with curly braces: `import { ReactFlow } from '@xyflow/react'`

### Type errors with node data
**Solution:** Use double assertion: `data: section as unknown as Record<string, unknown>`

### Nodes not appearing
**Solution:** Ensure sections have valid position coordinates and children array

### Canvas not responding
**Solution:** Verify ReactFlowProvider wraps ReactFlow component

## Testing Commands

```bash
# Type check
npm run type-check

# Build (may fail on font fetching - network issue, not code issue)
npm run build

# Dev server
npm run dev

# Run tests
npm test
```

## Summary

ReactFlow has been successfully integrated as the foundation for the Bentoblocks visual canvas. The setup includes:

- Core ReactFlow component with pan/zoom controls
- Utilities for data conversion between Page and ReactFlow structures
- Extended Zustand store with page-based actions
- Bauhaus-themed styling
- Test page demonstrating integration
- Type-safe implementation

The foundation is ready for the next agents to build custom node components, drag-and-drop functionality, and selection handling.

---

**Built by:** Group 2 Agent 1 - ReactFlow Setup
**Date:** 2025-10-23
**Status:** ✅ Complete
