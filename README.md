# Bentobuild

A drag-and-drop, AI-assisted website builder built with Next.js, React, and TypeScript.

## Features

- 🎨 **Drag & Drop Interface** - Intuitive block-based website building
- 🤖 **AI-Powered Content** - Generate relevant copy based on website context
- 🎯 **Modular Blocks** - Hero sections, text blocks, and image blocks
- ⚡ **Real-time Editing** - Instant content updates as you type
- 🎭 **Smooth Animations** - Powered by Framer Motion

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Testing**: Playwright
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Playwright tests

### Project Structure

```
bentobuild/
├── app/
│   ├── api/
│   │   └── generate-block-content/  # API route for AI content generation
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Main canvas page
│   └── globals.css                  # Global styles
├── components/
│   ├── blocks/                      # Block components
│   │   ├── HeroBlock.tsx
│   │   ├── TextBlock.tsx
│   │   └── ImageBlock.tsx
│   └── ui/                          # UI components
│       ├── ContextBox.tsx           # Context input
│       ├── Canvas.tsx               # Main canvas with DnD
│       └── BlockPalette.tsx         # Block selector
├── store/
│   └── useBuilderStore.ts           # Zustand state management
├── types/
│   └── block.types.ts               # TypeScript types
└── tests/                           # Playwright tests
```

## How It Works

1. **Context Input**: Users describe their website in the Context Box (e.g., "I'm a freelance photographer")
2. **Add Blocks**: Click blocks from the palette to add them to the canvas
3. **Drag & Reorder**: Drag blocks to reorder them on the canvas
4. **Edit Content**: Click on any block to select it and edit content inline
5. **AI Generation**: (Coming Soon) Generate block content based on context

## State Management

The app uses Zustand for global state management with the following state:

- `blocks` - Array of all blocks on the canvas
- `contextPrompt` - User's website description
- `selectedBlockId` - Currently selected block
- Actions: `addBlock`, `updateBlock`, `deleteBlock`, `setContextPrompt`, `selectBlock`, `reorderBlocks`

## API Routes

### `/api/generate-block-content`

**Status**: Stub (to be implemented)

**Purpose**: Generate AI-powered content for blocks based on context

**Request**:
```json
{
  "blockType": "hero" | "text" | "image",
  "contextPrompt": "User's website description"
}
```

**Response**:
```json
{
  "success": true,
  "content": {
    // Block-specific content fields
  }
}
```

## Next Steps

- [ ] Implement AI content generation API
- [ ] Add more block types (gallery, contact form, footer, etc.)
- [ ] Add export functionality (HTML/CSS)
- [ ] Add responsive preview modes
- [ ] Add undo/redo functionality
- [ ] Add block duplication
- [ ] Add save/load projects
- [ ] Add template library

## Contributing

This is an initial scaffold. Future agents will implement additional features.

## License

ISC
