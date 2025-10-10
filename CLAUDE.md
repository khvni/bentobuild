# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bentoblocks** is an AI-powered, drag-and-drop website builder built for simplicity and personalization.

**Tagline**: _"Describe it once. Build visually. Let AI do the rest."_

Users describe what their site is about once (e.g., "I'm a freelance designer showcasing my portfolio"), then visually assemble pages using modular "bento" blocks — pre-designed content sections such as Hero, About, Gallery, or Contact. Each block can auto-generate its copy, CTAs, and image suggestions using the user's context prompt, creating fast, tailored sites without manual editing.

### Core Objectives

1. Make building a personal website as intuitive as rearranging blocks
2. Use AI as a creative assistant, not a black box — suggestions, not takeovers
3. Deliver a fluid, responsive, design-driven experience that feels premium and fast

### User Flow

1. **Context Setup**: User enters a short description in the "Context Box" (e.g., "I'm a freelance UI/UX designer")
2. **Canvas Editing**: Drag and drop content blocks from the palette onto the canvas grid
3. **AI Personalization**: Each block has a "Generate with AI" button that fills in content consistent with the user's context
4. **Customization**: Users can edit text, replace images, or tweak styling directly in the block editor
5. **Preview & Deploy**: One-click deploy generates a live Daytona sandbox preview

## Development Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm test            # Run all Playwright tests
npx playwright test tests/example.spec.ts  # Run single test file
```

## Architecture

### Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | Next.js 15 (App Router), React, TypeScript |
| Styling | TailwindCSS |
| State | Zustand |
| Drag & Drop | @dnd-kit/core |
| AI | OpenAI GPT-4o-mini |
| Animation | Framer Motion |
| Testing | Playwright |
| Deployment | Daytona Sandbox |

### State Management (Zustand)

The entire application state lives in a single Zustand store at `store/useBuilderStore.ts`:

```typescript
{
  blocks: Block[],           // All blocks on canvas
  contextPrompt: string,     // User's site description
  selectedBlockId: string | null,

  // Actions
  addBlock(block),
  updateBlock(id, updates),
  deleteBlock(id),
  setContextPrompt(prompt),
  selectBlock(id),
  reorderBlocks(blocks)
}
```

**Critical**: All state mutations MUST go through these Zustand actions. Never modify state directly.

### Block System

Blocks are the core building units ("bento blocks"). Each block:

- Has a discriminated union type: `HeroBlock | TextBlock | ImageBlock | GalleryBlock | ContactBlock`
- Extends `BaseBlock` with `id`, `type`, and `order` fields
- Contains a `content` object with block-specific fields
- Renders via dedicated components in `components/blocks/`

**Data Model**:

```typescript
interface BaseBlock {
  id: string;
  type: "hero" | "text" | "image" | "gallery" | "contact";
  order: number;
  content: Record<string, string>;
}
```

**Adding new block types**:

1. Define type in `types/block.types.ts` (extend BaseBlock)
2. Add to the `Block` discriminated union
3. Create component in `components/blocks/`
4. Update Canvas.tsx's renderBlock switch statement
5. Add template to BlockPalette.tsx

### Drag & Drop Architecture

Uses `@dnd-kit/core` and `@dnd-kit/sortable`:

- `Canvas.tsx` wraps blocks in `DndContext` with `SortableContext`
- Each block is wrapped in `SortableBlock` component using `useSortable` hook
- `handleDragEnd` updates block order via `reorderBlocks` action
- Drag handles are currently attached to entire block (via `{...listeners}`)

### Layout Structure

```text
app/page.tsx:
  ├── ContextBox (top)         - Global context input
  └── flex container
      ├── BlockPalette (left)  - Add blocks
      ├── Canvas (main)        - DnD area
      └── BlockEditor (right)  - Edit selected block (future)
```

This is a fixed layout. The Canvas takes remaining flex space and scrolls independently.

### AI Content Generation

**AI Prompt Logic**: Each block generation uses this template:

```text
You are generating web copy for a {blockType} section.
User context: "{contextPrompt}"
Return concise, natural-sounding text as JSON:
{ title, body, cta?, imageUrl? }
```

**Current State**: All AI features have been fully integrated into main branch:
- `/api/generate-block-content` - Per-block AI content generation
- `/api/bento-build` - Full-site AI generation with Bento Build button

**Request format**:

```json
POST /api/generate-block-content
{
  "blockType": "hero" | "text" | "image",
  "contextPrompt": "user's site description",
  "existingFields": { /* optional current content */ }
}
```

**Response format**:

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

The implementation uses OpenAI's GPT-4o-mini with structured JSON output.

**Fallback**: If model fails, use static defaults per block type.

### Bento Build Feature

The **Bento Build** button in the ContextBar allows users to generate a complete website layout with one click:

- Located in the top ContextBar next to the Save button
- Generates a full site structure: Navbar → Hero → Content blocks → Footer
- Uses the user's context prompt to create relevant, personalized content
- Leverages OpenAI GPT-4o-mini to intelligently select and populate block types
- Replaces existing blocks on canvas when generating new layouts
- Shows loading states and error handling for robust UX

**Endpoint**: `/api/bento-build`

**Implementation**: `components/ui/ContextBar.tsx` + `lib/daytonaClient.ts`

### Feature Branch Integration Status

All feature branches have been successfully merged into main:

✅ **feature/state-manager** - Undo/redo + localStorage persistence
✅ **feature/layout-engine** - Enhanced drag-drop UX
✅ **feature/block-editor** - Right-side editing panel
✅ **feature/ai-generator** - OpenAI integration
✅ **feature/context-system** - Context propagation & bulk regeneration
✅ **feature/deployment** - Preview/deploy via Daytona
✅ **feature/bento-build** - Full-site AI generation
✅ **feature/testing-suite** - Comprehensive E2E tests

All worktree features are now available in the main branch.

## Design Principles

- **Minimal Surface, Max Feedback**: Everything happens in one screen
- **Frictionless Flow**: No page reloads or nested dialogs
- **AI as Co-Pilot**: Always editable; never overwrite user input silently
- **Responsive Grid**: Blocks adapt cleanly from desktop → mobile
- **Micro-Delight**: Motion and state transitions are subtle but intentional

## TypeScript Patterns

**Path aliases**: Use `@/*` to import from project root (configured in tsconfig.json)

```typescript
import { useBuilderStore } from '@/store/useBuilderStore';
import { Block } from '@/types/block.types';
```

**Client components**: All interactive components use `'use client'` directive (Zustand hooks, event handlers, @dnd-kit)

**Type discrimination**: Block types use discriminated unions on the `type` field. Always check `block.type` before accessing type-specific content fields.

## Testing

Playwright is configured for E2E testing:

- Tests live in `tests/`
- Config: `playwright.config.ts`
- Automatically starts dev server before running tests
- Tests should verify drag-drop, block addition, and context updates

## Important Conventions

1. **Block IDs**: Generated as `${blockType}-${Date.now()}` in BlockPalette.tsx
2. **Block Selection**: Clicking a block calls `selectBlock(id)`. Selected blocks show yellow ring via `ring-4 ring-yellow-400`
3. **Animations**: Use Framer Motion (`framer-motion`) for block entrance/interactions
4. **Inline Editing**: Block components handle their own content editing via input fields that call `updateBlock`
5. **API Routes**: Follow Next.js 15 App Router conventions (`app/api/*/route.ts` with named exports)

## Environment Variables

Required for AI features:

```bash
OPENAI_API_KEY=sk-...  # For AI content generation (both per-block and Bento Build)
DAYTONA_API_KEY=...    # For deployment preview functionality
DAYTONA_API_URL=...    # Daytona API endpoint
```

Copy `.env.example` to `.env.local` and add your API keys.

## Future Enhancements

- **AI Image Generation**: Suggest relevant visuals per block (Unsplash or DALLE integration)
- **Themes**: One-click theme presets with Tailwind tokens
- **Export**: Static HTML export for self-hosting
- **Collaborative Editing**: WebSocket sync (Y.js)
- **Advanced Templates**: Industry-specific starter templates (portfolio, restaurant, agency)

## Implemented Features

✅ **AI Content Generation** - Per-block AI content via `/api/generate-block-content`
✅ **Bento Build** - Full-site AI generation with one click
✅ **Undo/Redo** - State history management with keyboard shortcuts
✅ **localStorage Persistence** - Auto-save and restore user work
✅ **Drag & Drop UX** - Enhanced block manipulation and reordering
✅ **Block Editor** - Right-side editing panel for selected blocks
✅ **Context System** - Propagation and bulk regeneration
✅ **Deployment Preview** - Daytona integration for live previews
✅ **Comprehensive Testing** - 114 E2E tests covering all workflows

## Guiding Philosophy

_"Visual editing meets intelligent generation — websites built from meaning, not markup."_
