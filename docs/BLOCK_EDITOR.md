# Block Editor Panel Documentation

## Overview

The Block Editor Panel is a comprehensive right-side editing interface for modifying selected sections and components in Bentoblocks. It provides real-time, property-level control over all aspects of the canvas content.

## Architecture

```
components/editor/
├── BlockEditorPanel.tsx          # Main panel component
├── editors/
│   ├── SectionEditor.tsx         # Section editing interface
│   ├── ComponentEditor.tsx       # Component wrapper editor
│   └── types/
│       ├── HeadingEditor.tsx     # Heading component editor
│       ├── TextEditor.tsx        # Text/paragraph editor
│       ├── ButtonEditor.tsx      # Button component editor
│       ├── ImageEditor.tsx       # Image component editor
│       └── LinkEditor.tsx        # Link component editor
└── controls/
    ├── ColorPicker.tsx           # Color selection control
    ├── LayoutPicker.tsx          # Layout type picker
    └── FontPicker.tsx            # Font family selector
```

## Components

### BlockEditorPanel

**Location**: `/components/editor/BlockEditorPanel.tsx`

The main panel component that determines what to display based on the current selection state.

**Behavior**:

- If nothing is selected → Shows "No Selection" placeholder
- If a section is selected → Renders `SectionEditor`
- If a component is selected → Renders `ComponentEditor`

**Selection Logic**:

1. Checks if `selectedBlockId` exists in `page.sections`
2. If not found, iterates through all sections' children to find matching component
3. Passes the appropriate editor with necessary props

**Usage**:

```tsx
import BlockEditorPanel from '@/components/editor/BlockEditorPanel';

// In main layout
<BlockEditorPanel />;
```

### SectionEditor

**Location**: `/components/editor/editors/SectionEditor.tsx`

Provides editing controls for section-level properties.

**Editable Properties**:

- **Layout Type**: Stack, Grid, or Absolute positioning
- **Stack Direction**: Vertical or Horizontal (for stack layout)
- **Grid Columns**: 1-4 columns (for grid layout)
- **Gap**: Spacing between child components (px)
- **Background Color**: Section background color
- **Component Count**: Read-only display of child components

**Actions**:

- Generate Content (AI integration placeholder)
- Delete Section (with confirmation)

**Real-time Updates**: All changes immediately update the Zustand store via `updateSection()`

### ComponentEditor

**Location**: `/components/editor/editors/ComponentEditor.tsx`

Wrapper component that routes to the appropriate type-specific editor.

**Supported Component Types**:

- `heading` → HeadingEditor
- `text` → TextEditor
- `button` → ButtonEditor
- `image` → ImageEditor
- `link` → LinkEditor
- `spacer` → Simple message (no editable properties)
- `divider` → Simple message (no editable properties)

**Common Actions** (all component types):

- Generate with AI (placeholder)
- Delete Component (with confirmation)

### Type-Specific Editors

#### HeadingEditor

**Location**: `/components/editor/editors/types/HeadingEditor.tsx`

**Editable Properties**:

- Text content (textarea)
- Heading level (H1-H6)
- Font family (dropdown)
- Text color (color picker)
- Font size (CSS value: px, rem, etc.)
- Font weight (100-900)

**Features**:

- 6-button grid for quick heading level selection
- Live preview of font family in dropdown
- Granular weight control (9 options)

#### TextEditor

**Location**: `/components/editor/editors/types/TextEditor.tsx`

**Editable Properties**:

- Body content (textarea, supports HTML)
- Font family
- Text color
- Font size
- Font weight

**Features**:

- Large textarea for longer content
- Rich text HTML support (note displayed)
- Same typography controls as HeadingEditor

#### ButtonEditor

**Location**: `/components/editor/editors/types/ButtonEditor.tsx`

**Editable Properties**:

- Button text
- Target URL
- Variant (filled, outlined, text)
- Background color (for filled variant only)
- Border radius
- Padding

**Features**:

- 3-button grid for variant selection
- Conditional background color picker (only for filled buttons)
- CSS-based styling inputs

#### ImageEditor

**Location**: `/components/editor/editors/types/ImageEditor.tsx`

**Editable Properties**:

- Image URL (source)
- Alt text (accessibility)
- Caption (optional)
- Object fit (cover, contain, fill)
- Border radius

**Features**:

- Live image preview (if URL is valid)
- Accessibility reminder for alt text
- 3-button grid for object-fit selection

#### LinkEditor

**Location**: `/components/editor/editors/types/LinkEditor.tsx`

**Editable Properties**:

- Link text
- Target URL
- Description/tooltip (optional)
- Text color
- Font size
- Font weight

**Features**:

- Description shown on hover (noted in UI)
- Typical link styling controls
- Simplified weight options (400-700)

## Reusable Controls

### ColorPicker

**Location**: `/components/editor/controls/ColorPicker.tsx`

**Props**:

```tsx
interface ColorPickerProps {
  value: string; // Hex color value
  onChange: (color: string) => void;
}
```

**Features**:

- Native HTML5 color input for visual selection
- Text input for manual hex entry (uppercase, monospace)
- Two-way sync between inputs
- Validates hex format before updating

**Usage**:

```tsx
<ColorPicker value="#FF0000" onChange={(color) => console.log(color)} />
```

### LayoutPicker

**Location**: `/components/editor/controls/LayoutPicker.tsx`

**Props**:

```tsx
interface LayoutPickerProps {
  value: LayoutType; // 'stack' | 'grid' | 'absolute'
  onChange: (type: LayoutType) => void;
}
```

**Features**:

- 3-column grid of buttons
- Icon + label for each layout type
- Active state styling (bauhaus-blue background)

**Icons**:

- Stack: `Layers`
- Grid: `Grid3x3`
- Absolute: `Move`

**Usage**:

```tsx
<LayoutPicker value="grid" onChange={(type) => console.log(type)} />
```

### FontPicker

**Location**: `/components/editor/controls/FontPicker.tsx`

**Props**:

```tsx
interface FontPickerProps {
  value?: FontFamily;
  onChange: (font: FontFamily) => void;
}
```

**Features**:

- Dropdown selector with all 12 supported fonts
- Options rendered in their respective font families (live preview)
- Defaults to 'Inter' if no value provided

**Available Fonts**:

- Inter
- Instrument Serif
- Noto Sans
- Lexend
- Manrope
- EB Garamond
- Playfair Display
- Roboto
- Open Sans
- Lato
- Montserrat
- Poppins

**Usage**:

```tsx
<FontPicker value="Inter" onChange={(font) => console.log(font)} />
```

## Design System

All components follow the Bauhaus design system:

### Colors

- Primary Blue: `bg-bauhaus-blue` (active states)
- Yellow: `bg-bauhaus-yellow` (AI generation button)
- Red: `bg-red-500` (destructive actions)
- Gray-50: `bg-gray-50` (panel background)

### Border Radii

- Small: `rounded-bauhaus-sm`
- Medium: `rounded-bauhaus-md`
- Large: `rounded-bauhaus-lg`

### Borders

- All inputs and buttons: `border-2 border-black`
- Inactive controls: `border-gray-300`

### Typography

- Headings: `bauhaus-h4` (uppercase)
- Labels: `text-sm font-bold uppercase`
- Inputs: `text-sm`

## State Management

All editor components use Zustand store actions for updates:

### Store Actions Used

```tsx
const { updateSection, deleteSection, updateComponent, deleteComponent, selectBlock } =
  useBuilderStore();
```

### Update Pattern

**Sections**:

```tsx
updateSection(sectionId, {
  layout: { ...section.layout, type: 'grid' },
  style: { ...section.style, backgroundColor: '#fff' },
});
```

**Components**:

```tsx
updateComponent(sectionId, componentId, {
  content: { ...component.content, text: 'New text' },
  style: { ...component.style, textColor: '#000' },
});
```

**Important**: Always spread existing properties to avoid overwriting unrelated fields.

## Real-Time Updates

All changes are applied immediately:

- No "Save" button required
- Changes propagate through Zustand store
- Canvas updates automatically via reactive subscriptions
- Undo/redo supported via history middleware

## Accessibility

- All inputs have descriptive labels (uppercase, bold)
- Color inputs paired with text inputs for keyboard entry
- Alt text explicitly requested for images
- Semantic HTML structure throughout

## Testing Checklist

### Section Editor

- [ ] Select section → editor appears
- [ ] Change layout type → canvas updates
- [ ] Toggle stack direction → layout changes
- [ ] Adjust grid columns → grid reconfigures
- [ ] Change background color → section color updates
- [ ] Delete section → section and children removed

### Component Editors

- [ ] Select heading → HeadingEditor appears
- [ ] Change text → updates in real-time
- [ ] Change heading level → h1-h6 applied
- [ ] Select button → ButtonEditor appears
- [ ] Change variant → button style updates
- [ ] Select image → ImageEditor appears with preview
- [ ] Update image URL → preview refreshes
- [ ] Select link → LinkEditor appears
- [ ] All color pickers update in real-time

### Controls

- [ ] ColorPicker: Click color input → picker opens
- [ ] ColorPicker: Type hex → updates visual picker
- [ ] LayoutPicker: Click layout → icon + label highlight
- [ ] FontPicker: Select font → preview in dropdown

### General

- [ ] No selection → "No Selection" placeholder shown
- [ ] Close button (X) → deselects and closes panel
- [ ] Delete confirmations → prompt before destructive actions
- [ ] Multiple rapid edits → no lag or race conditions

## Future Enhancements

### Planned Features

1. **AI Generation Integration**: Connect "Generate with AI" buttons to backend
2. **Rich Text Editor**: Replace textarea with WYSIWYG for text components
3. **Image Upload**: Direct file upload instead of URL-only
4. **Preset Styles**: One-click style templates per component type
5. **Advanced Grid Controls**: Row templates, areas, complex layouts
6. **Responsive Overrides**: Edit mobile/tablet breakpoint properties
7. **Animation Controls**: Entrance animations, hover effects
8. **Copy/Paste Styles**: Transfer styles between components

### Code Improvements

1. Extract common form patterns into shared components
2. Add TypeScript strict mode compliance checks
3. Implement debouncing for rapid text input updates
4. Add loading states for async operations
5. Keyboard shortcuts for common actions (e.g., Delete key)

## Troubleshooting

### Panel doesn't show selected item

- **Check**: `selectedBlockId` in Zustand store
- **Verify**: ID exists in `page.sections` or as a child component
- **Solution**: Use `selectBlock(id)` action to set selection

### Updates not applying

- **Check**: Zustand store is receiving updates (React DevTools)
- **Verify**: Correct `sectionId` and `componentId` passed
- **Solution**: Ensure spreading existing properties in update calls

### Color picker not syncing

- **Check**: Hex value format (must be 6-digit)
- **Verify**: Value prop is controlled
- **Solution**: Ensure parent component manages state correctly

### Font picker not showing fonts

- **Check**: Google Fonts loaded in layout
- **Verify**: Font names match exactly (case-sensitive)
- **Solution**: Check `/app/layout.tsx` font imports

## Integration

### Adding to Main Page

```tsx
import BlockEditorPanel from '@/components/editor/BlockEditorPanel';

export default function Page() {
  return (
    <div className="flex h-screen">
      {/* Left: Palette */}
      <div>...</div>

      {/* Center: Canvas */}
      <div className="flex-1">...</div>

      {/* Right: Editor Panel */}
      <BlockEditorPanel />
    </div>
  );
}
```

### Making Panel Collapsible (Optional)

```tsx
const [isPanelOpen, setIsPanelOpen] = useState(true);

{
  isPanelOpen && <BlockEditorPanel />;
}
```

## API Reference

### BlockEditorPanel

```tsx
// No props required - reads from Zustand store
<BlockEditorPanel />
```

### SectionEditor

```tsx
interface Props {
  section: Section;
  onClose: () => void;
}
```

### ComponentEditor

```tsx
interface Props {
  component: Component;
  sectionId: string;
  onClose: () => void;
}
```

### Type-Specific Editors

```tsx
interface Props {
  component: SpecificComponentType; // e.g., HeadingComponent
  sectionId: string;
}
```

## Performance Notes

- All updates are synchronous (no API calls)
- Zustand updates are optimized for minimal re-renders
- Large text inputs may benefit from debouncing (not yet implemented)
- Font picker renders all 12 options (negligible performance impact)

## Summary

The Block Editor Panel provides a professional, real-time editing experience for Bentoblocks. It follows the Bauhaus design system, integrates seamlessly with Zustand state management, and offers granular control over every aspect of sections and components.

**Key Strengths**:

- Immediate visual feedback
- Type-safe TypeScript implementation
- Consistent design system
- Extensible architecture
- Comprehensive property coverage

**Next Steps**:

1. Test all editors with real canvas content
2. Integrate AI generation endpoints
3. Add keyboard navigation support
4. Implement preset style library
