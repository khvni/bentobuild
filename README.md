# Bentoblocks

[![CI Pipeline](https://github.com/yourusername/bentoblocks/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/bentoblocks/actions/workflows/ci.yml)
[![Deployment Preview](https://github.com/yourusername/bentoblocks/actions/workflows/deployment-preview.yml/badge.svg)](https://github.com/yourusername/bentoblocks/actions/workflows/deployment-preview.yml)
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
- **Database**: Prisma + Supabase PostgreSQL
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
- Supabase account (for database) - [Sign up free](https://supabase.com)
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

### Database Setup

Bentoblocks uses **Prisma** with **Supabase PostgreSQL** for data persistence. Follow these steps to set up the database:

#### 1. Configure Database Connection

The `.env.example` file includes placeholder database URLs. Copy them to your `.env.local`:

```bash
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.futpuaxcyezkvrnfflmd:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.futpuaxcyezkvrnfflmd:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

**Replace `[YOUR-PASSWORD]`** with your actual Supabase database password from:

- Supabase Dashboard → Project Settings → Database → Connection String

**Connection String Details**:

- `DATABASE_URL`: Uses connection pooling (pgBouncer) - optimized for serverless environments
- `DIRECT_URL`: Direct database connection - required for running Prisma migrations

#### 2. Run Database Migrations

Once you've added your database credentials to `.env.local`, run the migration script:

```bash
# Option 1: Using the migration script
./scripts/migrate.sh

# Option 2: Manual migration commands
npx prisma migrate dev --name init
npx prisma generate
```

This will:

1. Create the database tables (User, Project, DeployedSite, etc.)
2. Generate the Prisma Client for TypeScript
3. Apply all schema changes to your Supabase database

#### 3. Verify Database Setup

Check that migrations were successful:

```bash
# View database schema in Prisma Studio
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to browse your database.

#### Database Schema

The Prisma schema includes the following models:

- **User** - Authentication and project ownership
  - `id`, `email`, `name`, `image`, `createdAt`, `updatedAt`
- **Project** - User websites
  - `id`, `userId`, `slug`, `name`, `contextPrompt`, `content` (JSON), `isPublic`, `subdomain`
- **DeployedSite** - Deployment metadata
  - `id`, `projectId`, `url`, `status`, `deployedAt`

All relations include cascade deletes for data integrity.

#### Security Features

- **No Raw SQL**: All database queries use Prisma's type-safe API
- **Input Validation**: Zod schemas validate all API inputs
- **Ownership Checks**: API routes verify user ownership before operations
- **SQL Injection Protection**: Prisma parameterizes all queries automatically

#### Troubleshooting

**Error: "Environment variable not found: DATABASE_URL"**

- Ensure `.env.local` exists and contains your database credentials
- Restart your dev server after adding environment variables

**Error: "Can't reach database server"**

- Check your Supabase password is correct
- Verify your Supabase project is active
- Ensure you're using the correct connection string (pooled vs direct)

**Migration conflicts**

- If you encounter migration conflicts, you can reset the database:
  ```bash
  npx prisma migrate reset
  ```
  **Warning**: This will delete all data in your database!

### Authentication Setup

Bentoblocks uses **NextAuth.js** for authentication with **GitHub** and **Google** OAuth providers. Follow these steps to set up authentication:

#### 1. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and add it to your `.env.local`:

```bash
NEXTAUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=http://localhost:3000
```

#### 2. Set Up GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: Bentoblocks (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID** and generate a new **Client Secret**
6. Add them to your `.env.local`:

```bash
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
```

#### 3. Set Up Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **"Create Credentials"** > **"OAuth client ID"**
5. Configure the OAuth consent screen if prompted (select "External" for testing)
6. Select **"Web application"** as the application type
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
8. Click **"Create"**
9. Copy the **Client ID** and **Client Secret**
10. Add them to your `.env.local`:

```bash
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

#### 4. Verify Authentication Setup

After completing the above steps, your `.env.local` should include:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

Start the development server and visit `http://localhost:3000/auth/signin` to test the authentication flow.

#### Security Best Practices

- **Never commit `.env.local`** to version control (it's in `.gitignore`)
- **Rotate secrets regularly** in production environments
- **Use environment-specific callback URLs** (localhost for dev, production domain for prod)
- **Enable 2FA** on your GitHub and Google accounts
- **Review OAuth app permissions** before granting access

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
bentoblocks/
├── app/                             # Next.js App Router
│   ├── api/
│   │   ├── bento-build/             # Full-site AI generation
│   │   ├── generate-block-content/  # Per-block AI generation
│   │   ├── projects/                # Project CRUD operations
│   │   │   ├── route.ts             # List & create projects
│   │   │   └── [id]/route.ts        # Get, update, delete project
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
│   ├── prisma.ts                    # Prisma client singleton
│   └── index.ts                     # Barrel export
├── prisma/                          # Database
│   └── schema.prisma                # Database schema
├── scripts/                         # Utility scripts
│   └── migrate.sh                   # Database migration helper
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

### `/api/projects`

Manage user projects with full CRUD operations.

**GET** - List all projects for a user:

```json
GET /api/projects?userId=user_123

Response:
{
  "projects": [
    {
      "id": "proj_123",
      "name": "My Portfolio",
      "slug": "my-portfolio",
      "contextPrompt": "I'm a freelance designer",
      "isPublic": false,
      "subdomain": "myportfolio",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**POST** - Create a new project:

```json
POST /api/projects
{
  "userId": "user_123",
  "name": "My Portfolio",
  "slug": "my-portfolio",
  "contextPrompt": "I'm a freelance designer",
  "blocks": [],
  "isPublic": false,
  "subdomain": "myportfolio"  // optional
}

Response:
{
  "project": { /* full project object */ }
}
```

### `/api/projects/[id]`

Manage individual projects.

**GET** - Get a single project:

```json
GET /api/projects/proj_123

Response:
{
  "project": {
    "id": "proj_123",
    "name": "My Portfolio",
    "slug": "my-portfolio",
    "blocks": [...],
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**PATCH** - Update a project:

```json
PATCH /api/projects/proj_123
{
  "userId": "user_123",  // Required for ownership verification
  "name": "Updated Portfolio",
  "blocks": [...],
  "isPublic": true
}

Response:
{
  "project": { /* updated project */ }
}
```

**DELETE** - Delete a project:

```json
DELETE /api/projects/proj_123?userId=user_123

Response:
{
  "message": "Project deleted successfully"
}
```

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
