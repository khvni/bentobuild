# Bentoblocks

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

- Node.js 18+
- npm or yarn
- OpenAI API key (for AI features)
- Daytona API key (optional, for deployment)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/bentoblocks.git
cd bentoblocks
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
OPENAI_API_KEY=sk-...
DAYTONA_API_KEY=...     # Optional
DAYTONA_API_URL=...     # Optional
```

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

### Project Structure

```
bentoblocks/
├── app/
│   ├── api/
│   │   ├── generate-block-content/  # Per-block AI generation
│   │   └── bento-build/             # Full-site AI generation
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Main canvas page
│   └── globals.css                  # Global styles
├── components/
│   ├── blocks/                      # Block components
│   │   ├── NavbarBlock.tsx
│   │   ├── HeroBlock.tsx
│   │   ├── TextBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── GalleryBlock.tsx
│   │   ├── ContactBlock.tsx
│   │   └── FooterBlock.tsx
│   └── ui/                          # UI components
│       ├── ContextBar.tsx           # Context + Bento Build button
│       ├── Canvas.tsx               # Main canvas with DnD
│       ├── BlockPalette.tsx         # Block selector
│       ├── BlockWrapper.tsx         # Sortable block wrapper
│       └── BlockEditor.tsx          # Right-side editing panel
├── lib/
│   └── daytonaClient.ts             # Daytona deployment integration
├── store/
│   └── useBuilderStore.ts           # Zustand state management
├── types/
│   └── block.types.ts               # TypeScript types
└── tests/                           # Playwright E2E tests
    ├── bento-build-api.spec.ts
    ├── bento-build-e2e.spec.ts
    ├── bento-build-ui.spec.ts
    ├── drag-drop.spec.ts
    └── example.spec.ts
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

## 📚 Documentation

For detailed development guidance, see [CLAUDE.md](./CLAUDE.md) which includes:
- Architecture details
- Block system conventions
- AI prompt engineering
- Testing strategies
- TypeScript patterns

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
