# SectionNode Component Documentation

## Overview

The **SectionNode** component is a custom ReactFlow node that represents a Section in the Bentoblocks visual canvas. It provides a rich, interactive UI for managing sections with Bauhaus-inspired styling, layout controls, and visual feedback.

## Location

`/home/user/bentobuild/components/canvas/nodes/SectionNode.tsx`

## Component Structure

### Props Interface

```typescript
interface SectionNodeProps extends NodeProps {
  data: Section;
}
```

The component extends ReactFlow's `NodeProps` and expects a `Section` object as its data.

### Key Features

1. **Visual Representation**: Displays section variant, order, and child component count
2. **Layout Controls**: Toggle between stack and grid layouts
3. **Component Management**: Add components button (implementation by Agent 3)
4. **Section Management**: Delete section with confirmation
5. **Drag & Drop**: Draggable handle for repositioning on canvas
6. **Selection State**: Visual feedback when selected (yellow ring)
7. **Layout Preview**: Visual representation of section layout type
8. **ReactFlow Handles**: Connection points for future linking features

## Component Anatomy

### 1. Drag Handle

Located at the top center of the section node:
- Yellow background (`bg-bauhaus-yellow`)
- GripVertical icon for visual affordance
- `cursor-grab` and `cursor-grabbing` states
- Positioned absolutely with `-top-4`

### 2. Section Header

**Left Side:**
- Variant icon in colored circle
- Section order badge ("Section 1", "Section 2", etc.)
- Section variant badge (hero, navbar, content, etc.)
- Child component count

**Right Side:**
- Layout toggle button (Layers icon for stack, Grid3x3 for grid)
- Add component button (blue, Plus icon)
- Delete section button (red, Trash2 icon)

### 3. Layout Preview

Shows visual representation of the section's layout:

**Stack Layout:**
- Horizontal or vertical flex layout
- 3 placeholder rectangles
- Direction indicator in label

**Grid Layout:**
- CSS Grid with configured columns
- 4-8 placeholder rectangles (based on column count)
- Column count in label

**Empty State:**
- "Drop components here or click + to add" message

### 4. Accent Line

- Bottom border with 2px height
- Color matches section variant
- Provides visual categorization

### 5. ReactFlow Handles

- **Target Handle** (top): Yellow circle, accepts incoming connections
- **Source Handle** (bottom): Blue circle, creates outgoing connections

## Available Actions

### handleAddComponent()

```typescript
const handleAddComponent = () => {
  console.log('Add component to section:', data.id);
};
```

Currently logs to console. Will be implemented by Agent 3 to open component palette.

### handleChangeLayout()

```typescript
const handleChangeLayout = () => {
  const layouts: ('stack' | 'grid')[] = ['stack', 'grid'];
  const currentIndex = layouts.indexOf(data.layout.type);
  const nextLayout = layouts[(currentIndex + 1) % layouts.length];

  updateSection(data.id, {
    layout: {
      ...data.layout,
      type: nextLayout,
      ...(nextLayout === 'grid' && { columns: 2 }),
    },
  });
};
```

Cycles between stack and grid layouts. When switching to grid, defaults to 2 columns.

### handleDelete()

```typescript
const handleDelete = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (confirm(`Delete ${data.variant} section?`)) {
    deleteSection(data.id);
  }
};
```

Prompts for confirmation before deleting section. Uses `stopPropagation` to prevent triggering selection.

### selectBlock()

```typescript
onClick={() => selectBlock(data.id)}
```

Called when clicking anywhere on the section node. Updates Zustand store with selected section ID.

## Layout Types

### Stack Layout

```typescript
type: 'stack'
direction: 'vertical' | 'horizontal'
```

Flexbox-based linear layout. Visual preview shows 3 rectangles arranged in the specified direction.

### Grid Layout

```typescript
type: 'grid'
columns: number
```

CSS Grid-based 2D layout. Visual preview shows rectangles in a grid with the specified column count.

## Variant Colors

Each section variant has a unique accent color:

| Variant      | Color     | Hex       |
|-------------|-----------|-----------|
| navbar      | Blue      | `#2563EB` |
| hero        | Red       | `#E63946` |
| content     | Gray      | `#4B5563` |
| features    | Purple    | `#8B5CF6` |
| gallery     | Green     | `#10B981` |
| testimonials| Orange    | `#F59E0B` |
| cta         | Pink      | `#EC4899` |
| footer      | Dark Gray | `#1F2937` |

These colors are used for:
- Variant icon background (20% opacity)
- Variant icon color
- Variant badge background
- Bottom accent line

## Bauhaus Design System

### Colors

- **Primary Yellow**: `bg-bauhaus-yellow` - Used for drag handle and selection ring
- **Primary Blue**: `bg-bauhaus-blue` - Used for add component button
- **Primary Red**: `bg-bauhaus-red` - Used for delete button
- **Black**: `border-black` - Used for borders

### Border Radius

- **Small**: `rounded-bauhaus-sm` - For buttons and small elements (2px)
- **Medium**: `rounded-bauhaus-md` - For layout preview (4px)
- **Large**: `rounded-bauhaus-lg` - For section container (6px)

### Shadows

- **Small**: `shadow-bauhaus-sm` - For drag handle
- **Large**: `shadow-bauhaus-lg` - For section container

### Transitions

All interactive elements use `bauhaus-transition` class:
- Duration: 200ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

## Selection State

When selected, the section node displays:

```typescript
${selected ? 'border-bauhaus-yellow ring-4 ring-bauhaus-yellow' : 'border-black'}
```

- Border color changes from black to yellow
- 4px yellow ring appears around the node
- z-index increases to 10 (via CSS)

## Styling System

### Container Styling

```typescript
className={`
  relative bg-white border-4 rounded-bauhaus-lg shadow-bauhaus-lg
  min-w-[800px] min-h-[200px] p-6
  transition-all duration-200
  ${selected ? 'border-bauhaus-yellow ring-4 ring-bauhaus-yellow' : 'border-black'}
`}
style={{
  backgroundColor: data.style.backgroundColor || '#FFFFFF',
}}
```

- Fixed minimum width (800px) ensures consistent node size
- Fixed minimum height (200px) provides space for controls
- Background color is dynamic based on section style configuration
- Padding (6 = 24px) provides internal spacing

### Button Styling

All buttons follow consistent patterns:

**Layout Toggle:**
```typescript
className="p-2 bg-gray-100 hover:bg-bauhaus-yellow border-2 border-black rounded-bauhaus-sm transition-colors bauhaus-transition"
```

**Add Component:**
```typescript
className="p-2 bg-bauhaus-blue hover:bg-blue-600 text-white border-2 border-black rounded-bauhaus-sm transition-colors bauhaus-transition"
```

**Delete:**
```typescript
className="p-2 bg-bauhaus-red hover:bg-red-600 text-white border-2 border-black rounded-bauhaus-sm transition-colors bauhaus-transition"
```

## Integration Points

### Zustand Store

The component uses three store actions:

1. **updateSection**: Updates section properties (layout changes, position)
2. **deleteSection**: Removes section from page
3. **selectBlock**: Sets the selected section ID

```typescript
const { updateSection, deleteSection, selectBlock } = useBuilderStore();
```

### ReactFlow

The component integrates with ReactFlow through:

1. **NodeProps**: Receives `data` (Section object) and `selected` (boolean)
2. **Handles**: Provides connection points for future edge creation
3. **Dragging**: Native ReactFlow dragging via drag handle

### Future Integration (Agent 3)

The `handleAddComponent` function will be enhanced to:
1. Open a component palette/modal
2. Allow selecting component type
3. Create and add component to section's children array

## Accessibility

### Keyboard Support

- All buttons are keyboard accessible (native button elements)
- Focused elements show Bauhaus-blue outline (defined in globals.css)

### ARIA Labels

Buttons have descriptive `title` attributes:
- Layout toggle: `Layout: stack` or `Layout: grid`
- Add component: `Add Component`
- Delete section: `Delete Section`

### Focus Indicators

All interactive elements use the global focus style:

```css
*:focus-visible {
  outline: 3px solid var(--bauhaus-blue);
  outline-offset: 2px;
}
```

## CSS Classes Reference

### Custom Classes (globals.css)

```css
/* Section Node z-index management */
.react-flow__node-section {
  z-index: 1;
}

.react-flow__node-section.selected {
  z-index: 10;
}

/* Handle interactions */
.react-flow__handle {
  cursor: crosshair;
  transition: all 0.2s;
}

.react-flow__handle:hover {
  transform: scale(1.3);
}
```

## Usage Example

```typescript
import SectionNode from '@/components/canvas/nodes/SectionNode';

const nodeTypes = {
  section: SectionNode,
};

// In ReactFlow component
<ReactFlow
  nodes={nodes}
  nodeTypes={nodeTypes}
  // ... other props
/>
```

## Performance Considerations

### Memoization

The component uses `React.memo` to prevent unnecessary re-renders:

```typescript
const SectionNode = memo(({ data, selected }: SectionNodeProps) => {
  // Component logic
});
```

Re-renders only occur when:
- `data` (Section object) changes
- `selected` state changes

### Display Name

```typescript
SectionNode.displayName = 'SectionNode';
```

Helps with debugging in React DevTools.

## Testing Checklist

After implementation, verify:

- [ ] Sections render correctly on canvas
- [ ] Drag handle works for repositioning
- [ ] Layout toggle cycles between stack and grid
- [ ] Grid layout shows correct column count in preview
- [ ] Stack layout shows correct direction in preview
- [ ] Add component button logs to console
- [ ] Delete button shows confirmation dialog
- [ ] Delete button removes section from canvas
- [ ] Selection shows yellow ring
- [ ] Variant colors display correctly
- [ ] Component count updates when children change
- [ ] Hover states work on all buttons
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Handles are clickable and hover effect works

## Future Enhancements

### Inline Section Title Editing

Future versions may include editable section titles:

```typescript
const [isEditingTitle, setIsEditingTitle] = useState(false);
const [title, setTitle] = useState(data.variant);
```

### Layout Configuration

Future versions may include detailed layout controls:
- Gap adjustment slider
- Alignment controls
- Padding controls
- Direction toggle for stack layouts

### Component Preview

Future versions may show actual component previews instead of placeholder rectangles.

### Responsive Preview

Future versions may include toggle to preview mobile/tablet layouts.

## Related Documentation

- [ReactFlow Setup](./REACTFLOW_SETUP.md) - ReactFlow integration guide
- [Design System](./DESIGN_SYSTEM.md) - Bauhaus design system
- [State Manager](./STATE_MANAGER.md) - Zustand store architecture
- [Accessibility](./ACCESSIBILITY.md) - Accessibility guidelines

## Component Dependencies

```json
{
  "@xyflow/react": "^12.3.5",
  "lucide-react": "^0.462.0",
  "react": "^19.0.0",
  "zustand": "^5.0.2"
}
```

## Icon Reference

All icons from `lucide-react`:

| Icon          | Purpose              |
|---------------|---------------------|
| Menu          | Section variant icon|
| Grid3x3       | Grid layout icon    |
| Layers        | Stack layout icon   |
| Plus          | Add component       |
| Trash2        | Delete section      |
| GripVertical  | Drag handle         |

## Conclusion

The SectionNode component is a critical piece of the Bentoblocks visual canvas. It provides an intuitive, accessible interface for managing sections while maintaining the Bauhaus aesthetic. The component is designed to be extensible, with clear integration points for future features like component drag-and-drop and inline editing.
