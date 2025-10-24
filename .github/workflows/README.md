# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for continuous integration and deployment. The CI pipeline ensures code quality, runs tests, and prepares the application for deployment.

## Workflows

### 1. CI Pipeline (`ci.yml`)

**Triggers:**

- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**

#### a. Lint & Type Check

- Runs ESLint to catch code quality issues
- Performs TypeScript type checking with `tsc --noEmit`
- Validates code formatting with Prettier
- **Duration:** ~1-2 minutes

#### b. Security Audit

- Runs `npm audit` to detect known vulnerabilities
- Continues on moderate-level issues (warnings only)
- **Duration:** ~30 seconds

#### c. Build

- Compiles the Next.js application
- Uploads build artifacts (.next directory)
- Verifies production build succeeds
- **Duration:** ~2-3 minutes

#### d. E2E Tests (Playwright)

- Runs comprehensive E2E tests across 3 browsers (Chromium, Firefox, WebKit)
- Uses matrix strategy for parallel browser testing
- Uploads test results and traces on failure
- **Duration:** ~5-8 minutes per browser

#### e. All Checks Passed

- Final gate that verifies all required jobs succeeded
- Blocks merge if any critical job fails
- **Duration:** ~5 seconds

### 2. Deployment Preview (`deployment-preview.yml`)

**Triggers:**

- Pull requests to `main` branch (opened, synchronized, reopened)

**Jobs:**

#### a. Preview Deployment

- Builds the project for preview
- Comments on PR with deployment info
- Ready for manual deployment to Vercel/Netlify/Daytona

#### b. Bundle Size Analysis

- Analyzes build output size
- Uploads bundle report as artifact
- Helps track bundle size over time

## Environment Variables

### Required for CI

No environment variables are strictly required for CI to pass. However, for full functionality:

**Optional (for AI features in tests):**

```yaml
OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
DAYTONA_API_KEY: ${{ secrets.DAYTONA_API_KEY }}
```

Add these as repository secrets in GitHub:
Settings → Secrets and variables → Actions → New repository secret

### Required for Deployment

For production deployment, ensure these secrets are set:

- `OPENAI_API_KEY` - OpenAI API key for AI content generation
- `DAYTONA_API_KEY` - (Optional) Daytona API key for preview deployments
- `UNSPLASH_ACCESS_KEY` - (Optional) Unsplash API key for images

## Caching Strategy

The CI pipeline uses npm caching to speed up builds:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
```

This caches `node_modules` based on `package-lock.json` hash.

## Browser Testing

Playwright tests run across three browsers in parallel:

- **Chromium** - Chrome/Edge compatibility
- **Firefox** - Firefox compatibility
- **WebKit** - Safari compatibility

Each browser runs as a separate job in the matrix strategy for faster execution.

## Artifacts

The pipeline uploads several artifacts for debugging:

1. **Build Output** (`.next/`)
   - Retained for 7 days
   - Useful for debugging build issues

2. **Playwright Test Results**
   - HTML reports per browser
   - Retained for 7 days
   - View detailed test execution

3. **Playwright Traces** (on failure)
   - Detailed execution traces
   - Screenshots and network logs
   - Critical for debugging test failures

4. **Bundle Analysis Report**
   - Build size metrics
   - Helps track bundle growth

## Dependabot Configuration

Automated dependency updates via `dependabot.yml`:

- **npm packages** - Weekly updates
- **GitHub Actions** - Weekly updates
- Groups minor/patch updates together
- Separate PRs for major version bumps

## CI Optimization

### Speed Improvements

1. **Parallel Jobs**: Lint, build, and tests run concurrently
2. **Matrix Strategy**: Browsers test in parallel
3. **npm ci**: Uses lockfile for deterministic installs
4. **Caching**: node_modules cached across runs
5. **Selective Playwright Install**: Only installs needed browsers

### Cost Optimization

- Tests only run on push to main and PRs
- Artifacts have 7-day retention
- Failed test traces only uploaded on failure

## Local Testing

Before pushing, run these commands locally:

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Format checking
npx prettier --check "**/*.{js,jsx,ts,tsx,json,css,md}"

# Tests
npm test

# Build
npm run build
```

## Troubleshooting

### Common Issues

**1. Playwright Tests Failing in CI but passing locally**

- Ensure you're using the same Node.js version (22+)
- Check for timing issues (CI is slower)
- Review uploaded test traces in artifacts

**2. Build Failures**

- Check TypeScript errors with `npx tsc --noEmit`
- Verify all environment variables are set
- Review build logs in CI output

**3. Lint Errors**

- Run `npm run lint` locally
- Fix issues or update ESLint config if needed

**4. Format Check Failures**

- Run `npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"` locally
- Commit formatted files

### Skipping CI (Emergency Only)

To skip CI on a commit (not recommended):

```bash
git commit -m "your message [skip ci]"
```

## Deployment Platforms

### Recommended: Vercel (Zero-Config)

**Automatic Setup:**

1. Import GitHub repository in Vercel dashboard
2. Vercel auto-detects Next.js
3. Add environment variables in Vercel UI
4. Deploy automatically on every push to main

**Environment Variables:**

- `OPENAI_API_KEY`
- `DAYTONA_API_KEY` (optional)
- `UNSPLASH_ACCESS_KEY` (optional)

**Benefits:**

- Zero-config Next.js deployments
- Automatic preview deployments for PRs
- Edge network with global CDN
- Free tier for personal projects

### Alternative: Netlify

**Setup:**

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

**Note:** Requires Next.js adapter for Netlify

### Alternative: Daytona (Built-in Integration)

The app has native Daytona integration:

- One-click preview from the app
- Sandbox environments
- Good for testing and demos

## Status Badges

Add these to your README (update username/repo):

```markdown
[![CI Pipeline](https://github.com/yourusername/bentoblocks/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/bentoblocks/actions/workflows/ci.yml)
[![Deployment Preview](https://github.com/yourusername/bentoblocks/actions/workflows/deployment-preview.yml/badge.svg)](https://github.com/yourusername/bentoblocks/actions/workflows/deployment-preview.yml)
```

## Maintenance

### Weekly Tasks

- Review Dependabot PRs
- Check for security alerts
- Monitor CI run times

### Monthly Tasks

- Review artifact storage usage
- Update Node.js version if needed
- Check for GitHub Actions updates

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js CI Best Practices](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Vercel Deployment Docs](https://vercel.com/docs)
