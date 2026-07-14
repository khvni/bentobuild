# Bentoblocks

[![CI Pipeline](https://github.com/khvni/bentobuild/actions/workflows/ci.yml/badge.svg)](https://github.com/khvni/bentobuild/actions/workflows/ci.yml)
[![Deployment Preview](https://github.com/khvni/bentobuild/actions/workflows/deployment-preview.yml/badge.svg)](https://github.com/khvni/bentobuild/actions/workflows/deployment-preview.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**_"Describe it once. Build visually. Let AI do the rest."_**

An AI-powered, drag-and-drop website builder that combines visual editing with intelligent content generation. Built with Next.js, React, and TypeScript.

## ✨ Features

- 🎨 **Drag & Drop Interface** - Intuitive block-based website building with smooth animations
- 🤖 **AI-Powered Content** - Full-site generation with Bento Build button
- 📝 **Per-Block AI Generation** - Generate context-aware copy for individual blocks
- 🎯 **Modular Blocks** - Navbar, Hero, Text, Image, Gallery, Contact, Footer blocks
- ⚡ **Real-time Editing** - Instant inline content updates
- 🔄 **Undo/Redo** - Full state history with keyboard shortcuts
- 💾 **Auto-Save** - localStorage persistence across sessions
- 🚀 **One-Click Deploy** - Preview via Daytona sandbox integration
- 🎭 **Smooth Animations** - Powered by Framer Motion
- ✅ **Comprehensive Tests** - 114 E2E tests with Playwright

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **AI**: OpenAI GPT-4o-mini
- **Animations**: Framer Motion
- **Testing**: Playwright (114 E2E tests)
- **Deployment**: Daytona Sandbox
- **Linting**: ESLint + Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ (recommended) or 18+
- npm 10+
- OpenAI API key (for AI features)
- Daytona API key (optional, for deployment)

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/khvni/bentobuild.git
cd bentobuild
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your API keys:

```bash
OPENAI_API_KEY=sk-...                    # Required for AI features
UNSPLASH_ACCESS_KEY=...                  # Optional for images (falls back to placeholders)
DAYTONA_API_KEY=...                      # Optional for deployment
DAYTONA_API_URL=...                      # Optional for deployment
```

**About Unsplash (Optional)**:

- Free tier: 50 requests/hour
- Get your key at: https://unsplash.com/developers
- If not set, the app will use placeholder images from Picsum Photos
- Provides high-quality, contextually relevant images for your blocks

4. **Run the development server**:

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Playwright tests
- `npx prettier --check "**/*.{js,jsx,ts,tsx,json,css,md}"` - Check code formatting
- `npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"` - Format code

### Project Structure

```
bentobuild/
├── app/                             # Next.js App Router
│   ├── api/
│   │   ├── bento-build/             # Full-site AI generation
│   │   ├── generate-block-content/  # Per-block AI generation
│   │   └── preview/                 # Preview deployment
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Main canvas page
│   └── globals.css                  # Global styles
├── components/
│   ├── accessibility/               # Accessibility components
│   │   └── VisuallyHidden.tsx
│   ├── blocks/                      # Block components
│   │   ├── NavbarBlock.tsx
│   │   ├── HeroBlock.tsx
│   │   ├── TextBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── ButtonBlock.tsx
│   │   ├── LinkBlock.tsx
│   │   └── FooterBlock.tsx
│   ├── ui/                          # Reusable UI components
│   │   ├── ContextBar.tsx           # Context + Bento Build
│   │   ├── Canvas.tsx               # DnD canvas
│   │   ├── BlockPalette.tsx         # Block selector
│   │   ├── BlockWrapper.tsx         # Sortable wrapper
│   │   ├── BlockEditorPanel.tsx     # Right-side editor
│   │   ├── ColorPicker.tsx
│   │   ├── FontSelector.tsx
│   │   ├── HistoryControls.tsx      # Undo/redo UI
│   │   └── PreviewButton.tsx
│   └── StateHydrator.tsx            # State rehydration
├── constants/                       # Application constants
│   ├── blockTypes.ts                # Block type definitions
│   ├── apiEndpoints.ts              # API route constants
│   ├── animations.ts                # Animation configs
│   ├── keyboard.ts                  # Keyboard shortcuts
│   ├── localStorage.ts              # Storage keys
│   └── index.ts                     # Barrel export
├── hooks/                           # Custom React hooks
│   ├── useBlockActions.ts
│   ├── useBlockEditor.ts
│   ├── useContextPrompt.ts
│   ├── useHistory.ts
│   ├── useAnnouncer.ts              # A11y announcer
│   ├── useFocusTrap.ts              # Focus management
│   └── index.ts                     # Barrel export
├── lib/                             # External integrations
│   ├── daytonaClient.ts             # Daytona API
│   ├── openai.ts                    # OpenAI integration
│   ├── localStorage.ts              # Storage utilities
│   └── index.ts                     # Barrel export
├── store/                           # Zustand state
│   ├── middleware/
│   │   ├── historyMiddleware.ts     # Undo/redo logic
│   │   └── persistenceMiddleware.ts # Auto-save logic
│   └── useBuilderStore.ts           # Main store
├── types/
│   └── block.types.ts               # TypeScript types
├── utils/                           # Utility functions
│   ├── contrastChecker.ts           # WCAG contrast
│   ├── test-helpers.ts              # Test utilities
│   └── index.ts                     # Barrel export
├── tests/                           # Playwright E2E tests
│   ├── bento-build-api.spec.ts
│   ├── bento-build-e2e.spec.ts
│   ├── bento-build-ui.spec.ts
│   ├── drag-drop.spec.ts
│   └── example.spec.ts
└── docs/                            # Documentation
    ├── ACCESSIBILITY.md             # A11y guidelines
    ├── STATE_MANAGER.md             # State architecture
    └── DESIGN_SYSTEM.md             # Design tokens
```

## 💡 How It Works

### Quick Start Workflow

1. **Enter Context**: Describe your website in the Context Bar (e.g., "I'm a freelance photographer showcasing my portfolio")
2. **Bento Build**: Click the "Bento Build" button to generate a complete website layout with AI
3. **Customize**: Edit any block content inline, drag to reorder, or add/delete blocks
4. **Preview**: Use the preview button to see your site in a live Daytona sandbox
5. **Save**: Your work auto-saves to localStorage

### Manual Building Workflow

1. **Add Blocks**: Drag blocks from the left palette onto the canvas
2. **Reorder**: Drag blocks vertically to reorder them
3. **Select & Edit**: Click a block to select it, then edit content inline or in the right panel
4. **AI Per Block**: Use the "Generate with AI" button on individual blocks
5. **Delete/Duplicate**: Use action buttons on selected blocks

## 🗂️ State Management

The app uses **Zustand** for global state management:

```typescript
{
  blocks: Block[],              // All blocks on canvas
  contextPrompt: string,        // User's site description
  selectedBlockId: string | null,
  history: State[],             // For undo/redo
  historyIndex: number,

  // Actions
  addBlock(block),
  addBlocks(blocks[]),          // Bulk add for Bento Build
  updateBlock(id, updates),
  deleteBlock(id),
  duplicateBlock(id),
  setContextPrompt(prompt),
  selectBlock(id),
  reorderBlocks(blocks),
  undo(),
  redo()
}
```

State persists to localStorage and syncs across page reloads.

## 🔌 API Routes

### `/api/generate-block-content`

Generate AI content for individual blocks.

**Request**:

```json
POST /api/generate-block-content
{
  "blockType": "hero" | "text" | "image" | "gallery" | "contact",
  "contextPrompt": "User's website description",
  "existingFields": { /* optional */ }
}
```

**Response**:

```json
{
  "success": true,
  "content": {
    "heading": "...",
    "body": "...",
    "cta": "...",
    "imageUrl": "..."
  }
}
```

### `/api/bento-build`

Generate a complete website layout with AI.

**Request**:

```json
POST /api/bento-build
{
  "contextPrompt": "User's website description"
}
```

**Response**:

```json
{
  "success": true,
  "blocks": [
    { "id": "...", "type": "navbar", "order": 0, "content": {...} },
    { "id": "...", "type": "hero", "order": 1, "content": {...} },
    // ... more blocks
    { "id": "...", "type": "footer", "order": N, "content": {...} }
  ]
}
```

## 🎯 Keyboard Shortcuts

- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Delete/Backspace` - Delete selected block
- `Cmd/Ctrl + D` - Duplicate selected block

## ✅ Completed Features

- [x] AI content generation API (per-block)
- [x] Bento Build (full-site AI generation)
- [x] All block types (Navbar, Hero, Text, Image, Gallery, Contact, Footer)
- [x] Undo/redo functionality
- [x] Block duplication
- [x] Auto-save/load via localStorage
- [x] Daytona deployment integration
- [x] Comprehensive E2E test suite (114 tests)
- [x] Drag & drop with smooth animations
- [x] Inline block editing

## 🚧 Future Enhancements

- [ ] AI image generation (Unsplash/DALL-E integration)
- [ ] Export functionality (static HTML/CSS)
- [ ] Theme presets
- [ ] Responsive preview modes
- [ ] Template library with industry-specific starters
- [ ] Collaborative editing (WebSocket sync)

## 📁 Project Organization

This project follows modern React/Next.js best practices with a clean separation of concerns:

- **`app/`** - Next.js 15 App Router (pages, layouts, API routes)
- **`components/`** - React components organized by type (blocks, ui, accessibility)
- **`constants/`** - Centralized constants (block types, API endpoints, animations, keyboard shortcuts)
- **`hooks/`** - Custom React hooks with barrel exports
- **`lib/`** - External service integrations (OpenAI, Daytona, localStorage)
- **`store/`** - Zustand state management with middleware
- **`types/`** - TypeScript type definitions
- **`utils/`** - Pure utility functions (contrast checker, test helpers)
- **`tests/`** - E2E tests with Playwright
- **`docs/`** - Detailed documentation (accessibility, state management, design system)

Each folder includes an `index.ts` barrel export for clean imports:

```typescript
import { BLOCK_TYPES, API_ENDPOINTS } from '@/constants';
import { useBlockActions, useHistory } from '@/hooks';
import { checkContrast } from '@/utils';
```

## 📚 Documentation

For detailed development guidance, see:

- **[CLAUDE.md](./CLAUDE.md)** - Development guide for Claude Code (architecture, conventions, workflows)
- **[docs/ACCESSIBILITY.md](./docs/ACCESSIBILITY.md)** - WCAG compliance and a11y best practices
- **[docs/STATE_MANAGER.md](./docs/STATE_MANAGER.md)** - State architecture and undo/redo implementation
- **[docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)** - Design tokens and component patterns

## 🤝 Contributing

Contributions are welcome! This project follows a modular architecture with clear separation of concerns. Please ensure:

- All new features include E2E tests
- TypeScript strict mode compliance
- ESLint passes without errors
- Follow existing code conventions

## 📄 License

ISC

---

Built with ❤️ using Next.js, React, TypeScript, and OpenAI
