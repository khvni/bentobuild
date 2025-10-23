# Component Node Architecture

This document describes the ComponentNode system in Bentoblocks' ReactFlow canvas architecture.

## Overview

Components are the smallest building blocks in Bentoblocks. They live inside sections and render content like headings, text, buttons, images, links, spacers, and dividers. The ComponentNode system provides a unified rendering framework for all component types.

## Architecture

### Component Hierarchy

```
Page
└── Section (ReactFlow Node)
    └── Component (Rendered inline or as ReactFlow Node)
        └── Renderer (Type-specific presentation)
```

### Two Rendering Modes

Components can be rendered in two ways:

1. **Inline Rendering** (Current Implementation)
   - Components render inside their parent SectionNode
   - Uses `InlineComponentRenderer` component
   - Layout controlled by parent section's layout config
   - Simpler, more performant

2. **ReactFlow Node Rendering** (Future/Optional)
   - Components render as separate ReactFlow nodes
   - Uses `ComponentNode` as node type
   - Allows independent positioning and dragging
   - More flexible but more complex

## File Structure

```
components/canvas/nodes/
├── ComponentNode.tsx                    # Universal component wrapper (for ReactFlow nodes)
├── InlineComponentRenderer.tsx          # Inline renderer (used by SectionNode)
└── renderers/
    ├── HeadingRenderer.tsx             # Renders heading components
    ├── TextRenderer.tsx                # Renders text/paragraph components
    ├── ButtonRenderer.tsx              # Renders button components
    ├── ImageRenderer.tsx               # Renders image components
    ├── LinkRenderer.tsx                # Renders link components
    ├── SpacerRenderer.tsx              # Renders spacer components
    └── DividerRenderer.tsx             # Renders divider components
```

## Core Components

### ComponentNode (ReactFlow Node Wrapper)

**Location**: `/components/canvas/nodes/ComponentNode.tsx`

Universal wrapper for all component types when rendered as ReactFlow nodes.

**Features**:
- Selection state management
- Drag handles (shows on hover/selection)
- Quick actions (duplicate, delete)
- Type badge
- Delegates rendering to type-specific renderers

**Props**:
```typescript
interface ComponentNodeProps extends NodeProps {
  data: Component & { parentSectionId?: string };
}
```

**Usage**:
```typescript
import ComponentNode from './nodes/ComponentNode';

const nodeTypes = {
  component: ComponentNode,
};
```

### InlineComponentRenderer (Inline Renderer)

**Location**: `/components/canvas/nodes/InlineComponentRenderer.tsx`

Renders components inline within their parent section (current implementation).

**Features**:
- Scaled-down preview (75% scale)
- Hover actions (delete button, type badge)
- Selection highlighting
- Click-to-select functionality

**Props**:
```typescript
interface Props {
  data: Component;
  sectionId: string;
  selected?: boolean;
}
```

**Usage**:
```typescript
import InlineComponentRenderer from './InlineComponentRenderer';

<InlineComponentRenderer
  data={component}
  sectionId={section.id}
/>
```

## Component Renderers

Each component type has its own renderer that handles type-specific presentation.

### HeadingRenderer

**Location**: `/components/canvas/nodes/renderers/HeadingRenderer.tsx`

Renders heading components (h1-h6).

**Features**:
- Dynamic heading level (1-6)
- Responsive font sizes (text-4xl to text-base)
- Custom font family and color support
- Line clamping (max 2 lines)

**Implementation**:
```typescript
const sizeMap = {
  1: 'text-4xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-base',
};
```

### TextRenderer

**Location**: `/components/canvas/nodes/renderers/TextRenderer.tsx`

Renders text/paragraph components with rich text support.

**Features**:
- HTML content rendering (dangerouslySetInnerHTML)
- Line clamping (max 3 lines)
- Prose typography styles
- Custom font family and color support

**Security Note**: Uses `dangerouslySetInnerHTML` for rich text. Content should be sanitized before storing.

### ButtonRenderer

**Location**: `/components/canvas/nodes/renderers/ButtonRenderer.tsx`

Renders button components with three variants.

**Variants**:
- **filled**: Solid background with border
- **outlined**: Transparent background with border
- **text**: Minimal styling, text only

**Features**:
- Variant-specific styling
- Custom background and text colors
- Click prevention (e.preventDefault)
- Bauhaus design tokens

### ImageRenderer

**Location**: `/components/canvas/nodes/renderers/ImageRenderer.tsx`

Renders image components with optional captions.

**Features**:
- Placeholder icon when no src
- Object-fit support (cover, contain, fill)
- Optional caption below image
- Fixed preview height (h-32)
- Responsive container

**Fallback**: Shows ImageIcon (lucide-react) when src is empty.

### LinkRenderer

**Location**: `/components/canvas/nodes/renderers/LinkRenderer.tsx`

Renders link components with external link icon.

**Features**:
- External link icon (lucide-react)
- Optional description text
- Custom text color support
- Click prevention (e.preventDefault)
- Line clamping on description (max 2 lines)

### SpacerRenderer

**Location**: `/components/canvas/nodes/renderers/SpacerRenderer.tsx`

Renders spacer components for vertical spacing.

**Features**:
- Configurable height
- Dashed border visualization
- Height label display
- Default height: 40px

**Visual**: Shows "Spacer: XXpx" label with dashed border.

### DividerRenderer

**Location**: `/components/canvas/nodes/renderers/DividerRenderer.tsx`

Renders horizontal divider lines.

**Features**:
- Configurable thickness
- Configurable color
- Padding above/below
- Default: 2px thick, black

## Integration with SectionNode

SectionNode renders components inline using InlineComponentRenderer:

```typescript
{data.children.length > 0 ? (
  <div
    className={
      data.layout.type === 'stack'
        ? `flex ${data.layout.direction === 'vertical' ? 'flex-col' : 'flex-row'}`
        : data.layout.type === 'grid'
        ? 'grid'
        : 'relative'
    }
    style={{
      gap: `${data.layout.gap || 16}px`,
      ...(data.layout.type === 'grid' && {
        gridTemplateColumns: `repeat(${data.layout.columns || 2}, 1fr)`,
      }),
    }}
  >
    {data.children.map((component) => (
      <InlineComponentRenderer
        key={component.id}
        data={component}
        sectionId={data.id}
      />
    ))}
  </div>
) : (
  /* Empty state */
)}
```

## Styling Guidelines

### Bauhaus Design Tokens

Components use Bauhaus design tokens from `tailwind.config.ts`:

**Colors**:
- `bauhaus-red`: #E63946
- `bauhaus-yellow`: #F1C40F (selection ring)
- `bauhaus-blue`: #2563EB (primary actions)
- `bauhaus-black`: #000000
- `bauhaus-white`: #FFFFFF

**Border Radius**:
- `bauhaus-sm`: 2px
- `bauhaus-md`: 4px
- `bauhaus-lg`: 6px

**Shadows**:
- `shadow-bauhaus-sm`: 2px 2px 0px rgba(0, 0, 0, 0.1)
- `shadow-bauhaus-md`: 4px 4px 0px rgba(0, 0, 0, 0.15)
- `shadow-bauhaus-lg`: 8px 8px 0px rgba(0, 0, 0, 0.2)

### Component Styling

**Selection State**:
```typescript
className={`
  ${selected ? 'border-bauhaus-yellow ring-2 ring-bauhaus-yellow' : 'border-gray-300'}
`}
```

**Hover Effects**:
```typescript
className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
```

### CSS Classes

**From globals.css**:
```css
/* Line clamping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Component Node z-index */
.react-flow__node-component {
  z-index: 5;
}

.react-flow__node-component.selected {
  z-index: 15;
}
```

## Props Interfaces

### Component Type Definitions

All component types are defined in `/types/canvas.types.ts`:

```typescript
// Base component
interface BaseComponent {
  id: string;
  type: ComponentType;
  position: {
    type: PositionType;
    absolute?: Position;
    grid?: GridPosition;
  };
  style: StyleConfig;
}

// Example: HeadingComponent
interface HeadingComponent extends BaseComponent {
  type: 'heading';
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}
```

### StyleConfig

```typescript
interface StyleConfig {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: FontFamily;
  fontSize?: string;
  fontWeight?: number;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  [key: string]: string | number | undefined;
}
```

## Adding New Component Types

To add a new component type to the system:

### 1. Define Type

Add to `/types/canvas.types.ts`:

```typescript
// Add to ComponentType union
export type ComponentType =
  | 'heading'
  | 'text'
  | 'newtype';  // Add new type

// Create interface
export interface NewTypeComponent extends BaseComponent {
  type: 'newtype';
  content: {
    // Define content fields
    field1: string;
    field2: number;
  };
}

// Add to Component union
export type Component =
  | HeadingComponent
  | NewTypeComponent;  // Add here
```

### 2. Create Factory

Add to `/lib/factories/componentFactory.ts`:

```typescript
export function createNewType(
  field1: string = 'default',
  positionType: PositionType = 'relative',
  options?: {
    absolute?: Position;
    grid?: GridPosition;
    style?: Partial<StyleConfig>;
  }
): NewTypeComponent {
  const base = createBaseComponent(
    'newtype',
    positionType,
    options?.absolute,
    options?.grid
  );

  return {
    ...base,
    type: 'newtype',
    content: {
      field1,
      field2: 0,
    },
    style: {
      ...base.style,
      ...options?.style,
    },
  };
}
```

### 3. Create Renderer

Create `/components/canvas/nodes/renderers/NewTypeRenderer.tsx`:

```typescript
import React from 'react';
import { NewTypeComponent } from '@/types/canvas.types';

interface Props {
  data: NewTypeComponent;
}

export default function NewTypeRenderer({ data }: Props) {
  return (
    <div
      style={{
        color: data.style.textColor,
        fontFamily: data.style.fontFamily,
      }}
    >
      {/* Render component content */}
      {data.content.field1}
    </div>
  );
}
```

### 4. Update ComponentNode

Add case to switch statement in both `ComponentNode.tsx` and `InlineComponentRenderer.tsx`:

```typescript
import NewTypeRenderer from './renderers/NewTypeRenderer';

const renderComponent = () => {
  switch (data.type) {
    case 'newtype':
      return <NewTypeRenderer data={data} />;
    // ... other cases
  }
};
```

### 5. Add Default Styles

Update `/lib/factories/componentFactory.ts`:

```typescript
const DEFAULT_STYLES: Record<ComponentType, StyleConfig> = {
  newtype: {
    fontFamily: 'Inter',
    fontSize: '1rem',
    textColor: '#111827',
  },
  // ... other types
};
```

## State Management

### Component Actions

Components are managed through Zustand store actions:

```typescript
// Add component to section
addComponent(sectionId: string, component: Component)

// Update component
updateComponent(sectionId: string, componentId: string, updates: Partial<Component>)

// Delete component
deleteComponent(sectionId: string, componentId: string)

// Select component
selectBlock(id: string | null)
```

### Usage Example

```typescript
import { useBuilderStore } from '@/store/useBuilderStore';

const { addComponent, deleteComponent } = useBuilderStore();

// Add a heading
const heading = createHeading('Hello World', 1);
addComponent(sectionId, heading);

// Delete a component
deleteComponent(sectionId, componentId);
```

## Performance Considerations

### Memoization

All renderers should be memoized for optimal performance:

```typescript
const ComponentNode = memo(({ data, selected }: ComponentNodeProps) => {
  // Component implementation
});

ComponentNode.displayName = 'ComponentNode';
```

### Rendering Optimizations

1. **Line Clamping**: Prevents long text from affecting layout
2. **Scaled Preview**: InlineComponentRenderer scales to 75% for compact view
3. **Conditional Hover**: Actions only show on hover/selection
4. **preventDefault**: Prevents actual navigation/clicks in preview mode

## Testing

### Testing Checklist

Visit `/canvas-test` and verify:

- [ ] All component types render inside sections
- [ ] Component selection shows yellow ring
- [ ] Delete button works on components
- [ ] Drag handles appear on hover (if using ComponentNode)
- [ ] Component badges show type on hover
- [ ] Styling matches component data
- [ ] Empty sections show layout visualization
- [ ] Sections with components show actual content
- [ ] Layout types (stack, grid) work correctly
- [ ] Component hover states work
- [ ] Type-specific features work (headings, buttons, images, etc.)

### Test Data

The canvas test page (`/canvas-test`) creates sample sections with components:

```typescript
const hero = createSection('hero', 1, { x: 100, y: 350 });
hero.children = [
  createHeading('Build Your Dream Website', 1),
  createText('Drag, drop, and publish in minutes'),
  createButton('Get Started', '/signup', 'filled'),
];
```

## Future Enhancements

### Planned Features

1. **Component Drag & Drop**: Drag components between sections
2. **Component Duplication**: Duplicate button implementation
3. **Inline Editing**: Edit component content directly on canvas
4. **Component Toolbar**: Quick formatting actions
5. **Component Presets**: Saved component styles
6. **Component Groups**: Compound components
7. **Component Variants**: Multiple style variants per type
8. **Component Animations**: Entry/exit animations

### Migration to ReactFlow Nodes

To migrate components from inline rendering to ReactFlow nodes:

1. Update `ReactFlowCanvas.tsx` to create component nodes:
   ```typescript
   const componentNodes = section.children.map((component) => ({
     id: component.id,
     type: 'component',
     position: { x: 0, y: 0 }, // Calculate based on layout
     data: { ...component, parentSectionId: section.id },
     parentNode: section.id,
     extent: 'parent',
   }));
   ```

2. Update `SectionNode` to remove `InlineComponentRenderer`
3. Configure parent-child relationships in ReactFlow

## Related Documentation

- [Canvas Types](../types/canvas.types.ts) - Type definitions
- [Component Factory](../lib/factories/componentFactory.ts) - Component creation
- [Section Node](./SECTION_NODE.md) - Parent container documentation
- [Zustand Store](../store/useBuilderStore.ts) - State management

## Troubleshooting

### Component Not Rendering

**Issue**: Component doesn't appear in section

**Solutions**:
1. Check component is in `section.children` array
2. Verify component type matches a renderer case
3. Check console for TypeScript errors
4. Ensure component has valid content fields

### Styling Not Applied

**Issue**: Custom styles don't show

**Solutions**:
1. Check `style` object is properly typed
2. Verify CSS properties are valid
3. Check inline styles in renderer
4. Ensure Tailwind classes are not being purged

### Selection Not Working

**Issue**: Can't select component

**Solutions**:
1. Check `selectBlock` is called with correct ID
2. Verify `selectedBlockId` state is updating
3. Check event propagation (stopPropagation)
4. Ensure component has onClick handler

### Layout Issues

**Issue**: Components not arranged correctly

**Solutions**:
1. Check parent section's layout config
2. Verify CSS Grid/Flexbox properties
3. Check gap and padding values
4. Inspect with browser DevTools

## Support

For questions or issues:
- Check [CLAUDE.md](../CLAUDE.md) for project overview
- Review [Canvas Types](../types/canvas.types.ts) for type reference
- Test with `/canvas-test` page
- Check console for errors
