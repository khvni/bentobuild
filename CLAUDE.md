# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bentobuild is a drag-and-drop, AI-assisted website builder built with Next.js 15 (App Router), TypeScript, and Zustand for state management. Users describe their website context (e.g., "I'm a freelance photographer"), add modular blocks (hero, text, image) to a canvas, and can generate AI-powered content for each block based on their context.

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

Blocks are the core building units. Each block:
- Has a discriminated union type: `HeroBlock | TextBlock | ImageBlock`
- Extends `BaseBlock` with `id`, `type`, and `order` fields
- Contains a `content` object with block-specific fields
- Renders via dedicated components in `components/blocks/`

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

```
app/page.tsx:
  ├── ContextBox (top)      - Global context input
  └── flex container
      ├── BlockPalette (left)  - Add blocks
      └── Canvas (main)        - DnD area
```

This is a fixed layout. The Canvas takes remaining flex space and scrolls independently.

### AI Content Generation

**Current State**: The `/api/generate-block-content` endpoint is stubbed in main branch but fully implemented in `feature/ai-generator` worktree.

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

The implemented version (in worktree) uses OpenAI's GPT-4o-mini with structured JSON output.

### Worktree Development Model

This project uses git worktrees for parallel feature development:

```
.trees/
├── layout-engine/     # Enhanced drag-drop UX
├── block-editor/      # Right-side editing panel
├── ai-generator/      # OpenAI integration (implemented)
├── context-system/    # Context propagation & bulk regeneration
├── deployment/        # Preview/deploy via Daytona
└── state-manager/     # Undo/redo + localStorage persistence
```

**Working with worktrees**:
- Each worktree is a separate working directory on its own branch
- Changes in one worktree don't affect others
- To work on a feature: `cd .trees/<feature-name>` then commit/push from there
- View all worktrees: `git worktree list`
- The `.trees/` directory is gitignored

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

Required for AI features (implemented in worktrees):
```
OPENAI_API_KEY=sk-...  # For content generation
```

Copy `.env.example` to `.env.local` when working with AI features.

## Known Limitations & TODOs

- AI content generation is stubbed in main branch (see `feature/ai-generator` worktree for implementation)
- No undo/redo yet (see `feature/state-manager` worktree)
- No block deletion UI (see `feature/layout-engine` worktree)
- No right-side editing panel (see `feature/block-editor` worktree)
- No localStorage persistence (see `feature/state-manager` worktree)
- Context Box doesn't trigger regeneration (see `feature/context-system` worktree)
