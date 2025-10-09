# Bentoblocks Bauhaus Design System

## Overview

The Bentoblocks design system is inspired by the **Bauhaus movement** — a modernist design philosophy emphasizing bold typography, primary colors, geometric shapes, and functional aesthetics. This document outlines the core principles, tokens, and patterns used throughout the application.

## Design Principles

1. **Bold Typography**: Large, confident type with strong weight variations and hierarchy
2. **Primary Colors**: Red, Yellow, Blue as accent colors alongside Black and White
3. **Geometric Shapes**: Circles, squares, triangles, and rectangles as decorative elements
4. **Asymmetric Layouts**: Dynamic, off-center compositions that create visual interest
5. **Functional Aesthetics**: Form follows function with minimal ornamentation
6. **Grid-Based Design**: Strong underlying structure with 8px spacing units
7. **High Contrast**: Clear distinction between elements for readability and impact
8. **Sharp Transitions**: Quick, snappy animations that feel confident and deliberate

---

## Color Palette

### Primary Bauhaus Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Bauhaus Red** | `#E63946` | Hero blocks, primary CTAs, accent elements |
| **Bauhaus Yellow** | `#F1C40F` | Text blocks, secondary accents, highlights |
| **Bauhaus Blue** | `#2563EB` | Image blocks, links, interactive elements |
| **Bauhaus Black** | `#000000` | Borders, typography, strong contrast |
| **Bauhaus White** | `#FFFFFF` | Backgrounds, negative space |

### Grayscale

| Shade | Hex Code | Usage |
|-------|----------|-------|
| Gray 50 | `#F9FAFB` | Light backgrounds |
| Gray 100 | `#F3F4F6` | Canvas background |
| Gray 200 | `#E5E7EB` | Borders, dividers |
| Gray 300 | `#D1D5DB` | Secondary borders |
| Gray 400 | `#9CA3AF` | Placeholder text |
| Gray 500 | `#6B7280` | Secondary text |
| Gray 600 | `#4B5563` | Body text |
| Gray 700 | `#374151` | Dark text |
| Gray 800 | `#1F2937` | Headings |
| Gray 900 | `#111827` | Primary text |

### CSS Custom Properties

```css
--bauhaus-red: #E63946;
--bauhaus-yellow: #F1C40F;
--bauhaus-blue: #2563EB;
--bauhaus-black: #000000;
--bauhaus-white: #FFFFFF;
```

### Tailwind Classes

```js
// Bauhaus primary colors
bg-bauhaus-red
text-bauhaus-yellow
border-bauhaus-blue
```

---

## Typography

### Font Families

- **Headings**: Instrument Serif (serif)
- **Body Text**: Noto Sans (sans-serif)

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 64px | 700 (Bold) | 1.1 | Extra large hero text |
| H1 | 48px | 700 (Bold) | 1.2 | Page titles, hero headings |
| H2 | 32px | 700 (Bold) | 1.3 | Section headings |
| H3 | 24px | 600 (Semibold) | 1.4 | Subsection headings |
| Body | 16px | 400 (Regular) | 1.6 | Paragraph text |
| Small | 14px | 400 (Regular) | 1.5 | Captions, labels |
| Tiny | 12px | 400 (Regular) | 1.4 | Meta text |

### CSS Classes

```css
.bauhaus-display { /* 64px, bold, serif */ }
.bauhaus-h1 { /* 48px, bold, serif */ }
.bauhaus-h2 { /* 32px, bold, serif */ }
.bauhaus-h3 { /* 24px, semibold, serif */ }
.bauhaus-body { /* 16px, regular, sans-serif */ }
```

### Typography Patterns

- **All Caps**: Used for buttons, labels, and small headings
- **Tracking**: Increased letter-spacing for uppercase text (0.05em - 0.1em)
- **Bold Hierarchy**: Strong weight differences between heading levels

---

## Spacing System

Based on an **8px grid**:

| Token | Value | Usage |
|-------|-------|-------|
| `bauhaus-1` | 8px | Tight spacing, small gaps |
| `bauhaus-2` | 16px | Default spacing between elements |
| `bauhaus-3` | 24px | Medium spacing, section padding |
| `bauhaus-4` | 32px | Large spacing, block padding |
| `bauhaus-5` | 40px | Extra large spacing |
| `bauhaus-6` | 48px | Section margins |
| `bauhaus-8` | 64px | Page-level spacing |

---

## Border Radius

Bauhaus design favors **sharp, geometric shapes** with minimal rounding:

| Token | Value | Usage |
|-------|-------|-------|
| `bauhaus-sm` | 2px | Subtle rounding on small elements |
| `bauhaus-md` | 4px | Standard rounding for blocks |
| `bauhaus-lg` | 6px | Large blocks and containers |
| Sharp (0px) | 0px | Completely square corners |

---

## Shadows

Bauhaus shadows are **hard-edged and offset** (not soft blur):

| Token | Value | Usage |
|-------|-------|-------|
| `bauhaus-sm` | `2px 2px 0px rgba(0,0,0,0.1)` | Small elements |
| `bauhaus-md` | `4px 4px 0px rgba(0,0,0,0.15)` | Cards, blocks |
| `bauhaus-lg` | `8px 8px 0px rgba(0,0,0,0.2)` | Elevated blocks |
| `bauhaus-xl` | `12px 12px 0px rgba(0,0,0,0.25)` | Hero sections |

### CSS Classes

```css
.shadow-bauhaus-sm
.shadow-bauhaus-md
.shadow-bauhaus-lg
.shadow-bauhaus-xl
```

---

## Geometric Decorations

### Shapes

The design system includes decorative geometric shapes:

- **Circle**: Rounded, soft accent
- **Square**: Sharp, structured accent
- **Triangle**: Dynamic, directional accent
- **Rectangle**: Extended, linear accent

### Implementation

Use the `GeometricDecoration` component:

```tsx
<GeometricDecoration
  position="top-left"
  variant="circle"
  color="red"
  size="md"
/>
```

**Props:**
- `position`: `'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`
- `variant`: `'circle' | 'square' | 'triangle' | 'rectangle'`
- `color`: `'red' | 'yellow' | 'blue' | 'black'`
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `animated`: `boolean` (default: true)

### Usage Guidelines

- Use geometric decorations **sparingly** — 2-3 per container max
- Place in corners or edges, never blocking content
- Reduce opacity (20-40%) for subtlety
- Match colors to the primary accent of the container

---

## Buttons

### Button Styles

Bauhaus buttons are **bold, uppercase, and geometric**:

```css
.bauhaus-button {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 2px;
  padding: 12px 24px;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bauhaus-button:hover {
  transform: translate(-2px, -2px);
}

.bauhaus-button:active {
  transform: translate(0, 0);
}
```

### Button Variants

| Variant | Description | Example |
|---------|-------------|---------|
| **Filled** | Solid background, bold border | Primary actions |
| **Outlined** | Transparent background, thick border | Secondary actions |
| **Text** | No background or border | Tertiary actions |

### Color Combinations

- **Primary**: Blue background, white text, black border
- **Secondary**: Yellow background, black text, black border
- **Danger**: Red background, white text, black border

---

## Grid & Layout

### Grid Background

Canvas uses a subtle grid pattern:

```css
.bauhaus-grid-bg {
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### Layout Structure

```
┌─────────────────────────────────────────────┐
│ Header (Bauhaus brand, controls)           │
├─────────────────────────────────────────────┤
│ Context Bar (AI context input)             │
├──────────┬──────────────────────┬───────────┤
│ Block    │ Canvas               │ Block     │
│ Palette  │ (Grid background)    │ Editor    │
│          │                      │           │
└──────────┴──────────────────────┴───────────┘
```

### Column Widths

- **Block Palette**: 288px (w-72)
- **Block Editor**: 320px (w-80)
- **Canvas**: Flexible (flex-1)

---

## Animations

### Timing Functions

Bauhaus animations are **quick and confident**:

```css
.bauhaus-transition {
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.bauhaus-transition-fast {
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Animation Principles

- **Snappy, not floaty**: Fast transitions (150-200ms)
- **Geometric movement**: Translate in straight lines, not curves
- **Bold entrances**: Use scale and opacity for block entrances
- **Hover lift**: Buttons and cards translate up-left on hover

---

## Block Design Patterns

### Block Structure

All blocks follow this pattern:

1. **Border accent**: Left border (8px) in Bauhaus color
2. **Shadow**: Hard-edged Bauhaus shadow
3. **Geometric decorations**: 2-3 subtle corner shapes
4. **AI regenerate button**: Top-right corner (when context exists)
5. **Content area**: Center-aligned or left-aligned content

### Color-Coded Blocks

| Block Type | Accent Color | Border |
|------------|--------------|--------|
| Hero | Red | Left 4px border + accent bar at bottom |
| Text | Yellow | Left 8px border |
| Image | Blue | Left 8px border |
| Button | Red | Left 8px border |
| Link | Yellow | Left 8px border |
| Navbar | Black | Bottom 4px border + top accent bar |

### Border Styles

- **Hero Block**: 4px solid black border all around
- **Other Blocks**: 8px left border in accent color
- **Navbar**: 4px bottom border in black

---

## Accent Bars

Gradient accent bars are used for visual interest:

```css
background: linear-gradient(
  to right,
  var(--bauhaus-red),
  var(--bauhaus-yellow),
  var(--bauhaus-blue)
);
```

**Usage:**
- Header bottom edge
- Hero block bottom edge
- Context bar top edge
- Block editor top edge

---

## Accessibility

### Color Contrast

All text meets **WCAG AA standards** for contrast:

- Black text on white backgrounds: 21:1
- White text on Bauhaus blue: 5.4:1
- Black text on Bauhaus yellow: 14.8:1

### Focus States

All interactive elements have visible focus states:

```css
focus:border-black
focus:ring-0
focus:outline-none
```

### Keyboard Navigation

- All drag-and-drop operations support keyboard alternatives
- Tab order follows visual hierarchy
- All buttons and inputs are keyboard accessible

---

## Component Patterns

### Empty States

Empty states include:
- Geometric decorations
- Bold heading (bauhaus-h3)
- Descriptive subtext (uppercase, small)
- Visual icon or placeholder

### Loading States

- Spinning loader icon (white on dark, gray on light)
- Blur effect on content being regenerated
- Disabled state styling on buttons

### Error States

- Red accent color
- Clear error message
- Dismissible notification
- Icon for visual emphasis

---

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### Mobile Adaptations

- Block palette collapses on mobile
- Canvas takes full width
- Block editor becomes a modal on small screens
- Geometric decorations scale down or hide

---

## File Locations

### Core Design Files

- **Global CSS**: `/app/globals.css`
- **Tailwind Config**: `/tailwind.config.ts`
- **Geometric Component**: `/components/ui/GeometricDecoration.tsx`

### Block Components

- `/components/blocks/HeroBlock.tsx`
- `/components/blocks/TextBlock.tsx`
- `/components/blocks/ButtonBlock.tsx`
- `/components/blocks/LinkBlock.tsx`
- `/components/blocks/NavbarBlock.tsx`
- `/components/blocks/ImageBlock.tsx`

### Layout Components

- `/components/ui/BlockPalette.tsx`
- `/components/ui/Canvas.tsx`
- `/components/ui/BlockEditorPanel.tsx`
- `/components/ui/ContextBar.tsx`

---

## Design Tokens Summary

```typescript
// Color tokens
const colors = {
  bauhaus: {
    red: '#E63946',
    yellow: '#F1C40F',
    blue: '#2563EB',
    black: '#000000',
    white: '#FFFFFF',
  }
};

// Spacing tokens (px)
const spacing = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
  8: 64,
};

// Border radius tokens (px)
const borderRadius = {
  sm: 2,
  md: 4,
  lg: 6,
};

// Shadow tokens
const shadows = {
  sm: '2px 2px 0px rgba(0, 0, 0, 0.1)',
  md: '4px 4px 0px rgba(0, 0, 0, 0.15)',
  lg: '8px 8px 0px rgba(0, 0, 0, 0.2)',
  xl: '12px 12px 0px rgba(0, 0, 0, 0.25)',
};
```

---

## Best Practices

### Do's

- Use bold typography for emphasis
- Apply geometric decorations sparingly
- Maintain high contrast between elements
- Use sharp, snappy animations
- Follow the 8px grid system
- Apply Bauhaus colors consistently

### Don'ts

- Don't overuse geometric shapes (max 2-3 per container)
- Don't use soft gradients or blurred shadows
- Don't use rounded corners excessively
- Don't use slow, floaty animations
- Don't mix non-Bauhaus colors without purpose
- Don't break the grid-based spacing system

---

## Future Enhancements

1. **Theme Variants**: Light/Dark mode with Bauhaus palette
2. **More Geometric Shapes**: Hexagons, pentagons for variety
3. **Pattern Library**: Repeating geometric patterns for backgrounds
4. **Animation Library**: Pre-built Bauhaus-style motion presets
5. **Icon System**: Custom Bauhaus-inspired iconography

---

## References

- [Bauhaus Movement (Wikipedia)](https://en.wikipedia.org/wiki/Bauhaus)
- [Bauhaus Design Principles](https://www.interaction-design.org/literature/topics/bauhaus)
- [Modernist Typography](https://www.smashingmagazine.com/2009/08/the-beauty-of-typography-part-1/)

---

**Version**: 1.0.0
**Last Updated**: 2025-10-09
**Maintained by**: Bentoblocks Team
