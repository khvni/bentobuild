# Contributing to Bentoblocks

Thank you for your interest in contributing to Bentoblocks! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/bentoblocks.git`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp .env.example .env.local`
5. Add your API keys to `.env.local`
6. Start development server: `npm run dev`

## Before Submitting a Pull Request

Run these commands to ensure your changes meet quality standards:

```bash
# Format your code
npm run format

# Check formatting
npm run format:check

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Build the project
npm run build
```

Or run all checks at once:

```bash
npm run ci
```

## Code Style Guidelines

- **TypeScript**: Use strict TypeScript types, avoid `any`
- **Components**: Use functional components with hooks
- **State**: All state mutations must go through Zustand actions
- **Imports**: Use path aliases (`@/*`) for imports
- **Formatting**: Code is automatically formatted with Prettier
- **Client Components**: Use `'use client'` directive for interactive components

## Commit Message Convention

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add new gallery block with image grid layout
```

## Pull Request Process

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes following the code style guidelines
3. Add tests for new features
4. Ensure all CI checks pass
5. Update documentation if needed
6. Submit a pull request with a clear description

## Testing

- Write E2E tests for new features using Playwright
- Tests should be comprehensive and cover edge cases
- Run tests locally before submitting: `npm test`

## Project Structure

```
bentoblocks/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── blocks/       # Block components
│   └── ui/           # UI components
├── hooks/            # Custom React hooks
├── lib/              # External integrations
├── store/            # Zustand state management
├── types/            # TypeScript types
└── tests/            # E2E tests
```

## Questions?

If you have questions or need help:
- Open an issue for bugs or feature requests
- Check existing documentation in `/docs`
- Review the [CLAUDE.md](./CLAUDE.md) for architecture details

## License

By contributing, you agree that your contributions will be licensed under the ISC License.
