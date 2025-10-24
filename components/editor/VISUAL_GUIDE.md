# Block Editor Panel - Visual Guide

## Panel States

### State 1: No Selection

```
┌─────────────────────────────────┐
│  Block Editor Panel             │
│  (w-80, 320px)                  │
├─────────────────────────────────┤
│                                 │
│                                 │
│        ┌─────────┐              │
│        │  Type   │              │
│        │  Icon   │              │
│        └─────────┘              │
│                                 │
│      No Selection               │
│                                 │
│  Click a section or component   │
│  to edit its properties         │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### State 2: Section Selected

```
┌─────────────────────────────────┐
│  Section Settings           [X] │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │ Type                    │   │
│  │ HERO                    │   │
│  └─────────────────────────┘   │
│                                 │
│  Layout                         │
│  ┌────┬────┬────┐               │
│  │ 🔘 │    │    │  Stack        │
│  │    │ 🔘 │    │  Grid         │
│  │    │    │ 🔘 │  Absolute     │
│  └────┴────┴────┘               │
│                                 │
│  Direction (Stack)              │
│  [Vertical] [Horizontal]        │
│                                 │
│  Gap (px)                       │
│  [16        ]                   │
│                                 │
│  Background                     │
│  [🎨] [#FFFFFF        ]         │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Components: 3           │   │
│  └─────────────────────────┘   │
│                                 │
│  [✨ Generate Content     ]     │
│  [🗑️  Delete Section      ]     │
└─────────────────────────────────┘
```

### State 3: Heading Component Selected

```
┌─────────────────────────────────┐
│  HEADING Settings           [X] │
├─────────────────────────────────┤
│  Text                           │
│  ┌─────────────────────────┐   │
│  │ Welcome to my site      │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  Level                          │
│  [H1][H2][H3][H4][H5][H6]       │
│   🔘                            │
│                                 │
│  Font                           │
│  [Inter              ▼]         │
│                                 │
│  Color                          │
│  [🎨] [#000000        ]         │
│                                 │
│  Size                           │
│  [48px              ]           │
│                                 │
│  Weight                         │
│  [Bold (700)        ▼]          │
│                                 │
│  [✨ Generate with AI     ]     │
│  [🗑️  Delete Component    ]     │
└─────────────────────────────────┘
```

### State 4: Image Component Selected

```
┌─────────────────────────────────┐
│  IMAGE Settings             [X] │
├─────────────────────────────────┤
│  Image URL                      │
│  [https://...            ]      │
│                                 │
│  ┌─────────────────────────┐   │
│  │    Image Preview        │   │
│  │    (128px height)       │   │
│  └─────────────────────────┘   │
│                                 │
│  Alt Text                       │
│  [Hero image            ]       │
│  For accessibility and SEO      │
│                                 │
│  Caption                        │
│  [Optional caption...    ]      │
│                                 │
│  Object Fit                     │
│  [Cover][Contain][Fill]         │
│   🔘                            │
│                                 │
│  Border Radius                  │
│  [8px                ]          │
│                                 │
│  [✨ Generate with AI     ]     │
│  [🗑️  Delete Component    ]     │
└─────────────────────────────────┘
```

### State 5: Button Component Selected

```
┌─────────────────────────────────┐
│  BUTTON Settings            [X] │
├─────────────────────────────────┤
│  Text                           │
│  [Get Started            ]      │
│                                 │
│  URL                            │
│  [https://example.com    ]      │
│                                 │
│  Variant                        │
│  [Filled][Outlined][Text]       │
│   🔘                            │
│                                 │
│  Background (Filled only)       │
│  [🎨] [#000000        ]         │
│                                 │
│  Border Radius                  │
│  [8px                ]          │
│                                 │
│  Padding                        │
│  [12px 24px          ]          │
│                                 │
│  [✨ Generate with AI     ]     │
│  [🗑️  Delete Component    ]     │
└─────────────────────────────────┘
```

## User Flow Diagram

```
User clicks → Component/Section
       ↓
selectBlock(id) called
       ↓
BlockEditorPanel receives selectedBlockId
       ↓
     ┌─────────────────────┐
     │ Is it a Section?    │
     └─────────────────────┘
         ↙           ↘
       Yes           No
        ↓             ↓
  SectionEditor   Is it a Component?
                      ↓
                    Yes
                      ↓
                ComponentEditor
                      ↓
                Type-specific editor:
                - HeadingEditor
                - TextEditor
                - ButtonEditor
                - ImageEditor
                - LinkEditor
```

## Update Flow

```
User edits field
       ↓
onChange handler
       ↓
updateSection() or updateComponent()
       ↓
Zustand store updated
       ↓
Canvas re-renders
       ↓
Visual feedback (instant!)
```

## Layout Breakdown

### Full App Layout

```
┌────────────────────────────────────────────────────────────────┐
│                          Header                                │
│  Bentoblocks                              [Undo][Redo][Preview]│
└────────────────────────────────────────────────────────────────┘
┌──────────┬────────────────────────────────┬────────────────────┐
│          │                                │                    │
│ Palette  │        Canvas                  │   Block Editor     │
│ (240px)  │      (flex-1)                  │   Panel (320px)    │
│          │                                │                    │
│ ┌──────┐ │  ┌──────────────────────┐     │  ┌──────────────┐  │
│ │Hero  │ │  │ Section: Hero        │     │  │ Section      │  │
│ └──────┘ │  │  - Heading           │ ◄───┼──│ Settings     │  │
│          │  │  - Text              │     │  │              │  │
│ ┌──────┐ │  │  - Button            │     │  │ Layout: Grid │  │
│ │Text  │ │  └──────────────────────┘     │  │              │  │
│ └──────┘ │                                │  │ Background   │  │
│          │  ┌──────────────────────┐     │  │ [#FFFFFF]    │  │
│ ┌──────┐ │  │ Section: Features    │     │  │              │  │
│ │Image │ │  │  - Image             │     │  │ Components:3 │  │
│ └──────┘ │  │  - Heading           │     │  └──────────────┘  │
│          │  │  - Text              │     │                    │
└──────────┴────────────────────────────────┴────────────────────┘
```

## Color Scheme

```
┌─────────────────────────────────┐
│  Bauhaus Color System           │
├─────────────────────────────────┤
│                                 │
│  🔵 Blue (Primary)              │
│  #3B82F6  Active states         │
│                                 │
│  🟡 Yellow (AI)                 │
│  #FBBF24  Generate buttons      │
│                                 │
│  🔴 Red (Destructive)           │
│  #EF4444  Delete buttons        │
│                                 │
│  ⚫ Black (Borders)             │
│  #000000  All borders           │
│                                 │
│  ⚪ Gray-50 (Background)        │
│  #F9FAFB  Panel background      │
│                                 │
└─────────────────────────────────┘
```

## Spacing System

```
┌─────────────────────────────────┐
│  Spacing (Tailwind)             │
├─────────────────────────────────┤
│  gap-2  = 8px   Between buttons │
│  gap-4  = 16px  Between sections│
│  p-6    = 24px  Panel padding   │
│  p-4    = 16px  Card padding    │
│  mb-2   = 8px   Label margin    │
│  mb-4   = 16px  Section margin  │
│  mb-6   = 24px  Group margin    │
└─────────────────────────────────┘
```

## Border System

```
┌─────────────────────────────────┐
│  Border Styles                  │
├─────────────────────────────────┤
│  border-2    Main panel border  │
│  border-4    Section borders    │
│  border-black All emphasized    │
│  border-gray-300 Inactive       │
└─────────────────────────────────┘
```

## Typography

```
┌─────────────────────────────────┐
│  Text Styles                    │
├─────────────────────────────────┤
│  bauhaus-h4      Panel titles   │
│  text-sm         Most labels    │
│  text-xs         Helper text    │
│  font-bold       All labels     │
│  uppercase       Labels + titles│
└─────────────────────────────────┘
```

## Component Hierarchy

```
BlockEditorPanel
├── No Selection State
│   └── Placeholder content
│
├── Section Selected
│   └── SectionEditor
│       ├── Header (title + close)
│       ├── Section Info Card
│       ├── LayoutPicker
│       ├── Direction/Columns Controls
│       ├── ColorPicker
│       ├── Component Count
│       └── Actions (Generate, Delete)
│
└── Component Selected
    └── ComponentEditor
        ├── Header (type + close)
        ├── Type-Specific Editor
        │   ├── HeadingEditor
        │   ├── TextEditor
        │   ├── ButtonEditor
        │   ├── ImageEditor
        │   └── LinkEditor
        └── Actions (Generate, Delete)
```

## Interaction Patterns

### Edit Pattern

```
1. Click component/section
2. Panel opens with editor
3. Change any field
4. See instant update on canvas
5. No save needed!
```

### Delete Pattern

```
1. Click Delete button
2. Confirm dialog appears
3. Confirm deletion
4. Item removed from canvas
5. Panel shows "No Selection"
```

### Navigation Pattern

```
1. Click different component
2. Previous editor closes
3. New editor opens
4. Seamless transition
```

## Responsive Behavior

Panel is fixed width (320px) but content scrolls:

```
┌────────────────────┐  ← w-80 (320px)
│  [Header]          │  ← sticky
├────────────────────┤
│                    │
│  Scrollable        │  ← overflow-y-auto
│  Content           │
│                    │
│  [Controls]        │
│  [Controls]        │
│  [Controls]        │  ← may extend
│  [Controls]        │     beyond viewport
│  [Controls]        │
│                    │
│  [Actions]         │  ← at bottom of scroll
└────────────────────┘
```

## Keyboard Support

- **Tab**: Navigate between fields
- **Enter**: Confirm text input
- **Esc**: Close panel (future)
- **Delete**: Delete selected (future)

## Screen Reader Support

All controls have proper labels:

- Input labels use `<label>` elements
- Color pickers have aria-label
- Buttons have descriptive text
- Icon-only buttons get aria-label
