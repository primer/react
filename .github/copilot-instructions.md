# Primer React Copilot Instructions

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Repository Organization

The project is the React implementation of GitHub's Primer Design System authored as a monorepo with separate npm workspaces.
The primary workspace is `packages/react` which contains the `@primer/react` package that distributes React components for the design system.

**Key Directory Structure:**

- `e2e/`: End-to-end tests running Visual Regression Tests (@vrt) and Accessibility Verification Tests (@avt) using Playwright
- `examples/`: Example applications (nextjs, theming, codesandbox) demonstrating design system usage
- `packages/react/`: Primary package containing all React components and main development workspace
- `packages/mcp/`: Model Context Protocol server for AI tools integration
- `packages/styled-react/`: Legacy styled-components package (being migrated from)
- `script/`: Repository-wide build and utility scripts
- `contributor-docs/`: Contributing guidelines, testing docs, and Architecture Decision Records (ADRs)

## Working Effectively

**Bootstrap and build the repository:**

- Dependencies: Node.js (check with `node --version`), npm (check with `npm --version`)
- `npm install` -- installs dependencies. ~5 seconds with cache, ~2 minutes for clean install. Set timeout to 180+ seconds.
- `npm run build` -- builds all packages. NEVER CANCEL. Takes 90 seconds without turbo cache, ~1 second with cache. Set timeout to 120+ minutes.
- `npx turbo build` -- builds all packages including example applications. Takes ~33 seconds.

**Run tests:**

- `npm test` -- runs unit tests. NEVER CANCEL. Takes 75 seconds. Set timeout to 90+ minutes. Runs 1500+ tests using Vitest in both node and chromium environments.
- `npm run type-check` -- runs TypeScript type checking across all packages. Takes 42 seconds. Set timeout to 60+ minutes.

**Development workflow:**

- `npm start` -- starts Storybook dev server on http://localhost:6006. Takes ~3 seconds to start.
- Main component development happens in `packages/react/src/[ComponentName]/`
- Stories are in component directories as `ComponentName.stories.tsx`

**Visual Regression and Accessibility Testing:**

- Install Playwright: `npx playwright install --with-deps` -- takes ~3 seconds
- Start Storybook first: `npm start` (must be running on port 6006)
- Run VRT: `script/test-e2e --grep @vrt` -- runs visual regression tests against Storybook components
- Run AVT: `script/test-e2e --grep @avt` -- runs accessibility verification tests using axe
- **WARNING**: E2E tests require Storybook running and can take 15+ minutes. NEVER CANCEL. Set timeout to 30+ minutes.

**Linting and formatting:**

- `npm run lint` -- lints JavaScript/TypeScript/Markdown. Takes 73 seconds.
- `npm run lint:fix` -- auto-fixes linting issues where possible
- `npm run lint:css` -- lints CSS files using Stylelint. Takes 6 seconds.
- `npm run lint:css:fix` -- auto-fixes CSS linting issues
- `npm run format` -- formats code using Prettier
- `npm run format:diff` -- checks for unformatted files. Takes 2 seconds.

## Validation Scenarios

**Always validate your changes by:**

1. Building the project: `npm run build` (ensures TypeScript compilation succeeds)
2. Running unit tests: `npm test` (ensures component behavior works correctly)
3. Type checking: `npm run type-check` (ensures TypeScript types are correct)
4. Linting: `npm run lint` and `npm run lint:css` (ensures code style compliance)
5. Formatting: `npm run format:diff` (ensures consistent code formatting)

**For component changes:**

1. Start Storybook: `npm start`
2. Navigate to your component story to visually verify changes
3. Run accessibility tests: `script/test-e2e --grep @avt` if accessibility is impacted
4. Run visual regression tests: `script/test-e2e --grep @vrt` if visual appearance changed

**Before committing:**

- Always run `npm run format` before committing or CI will fail
- Run `npm run lint:fix` to auto-fix linting issues
- Ensure `npm run build` succeeds without errors

## Component Development Guide

**File Structure (packages/react/src/):**
Components follow this pattern:

```
ComponentName/
├── index.ts              // Re-exports
├── ComponentName.tsx     // Main component
├── ComponentName.stories.tsx  // Storybook stories
├── ComponentName.test.tsx     // Unit tests
├── ComponentName.docs.json    // Documentation metadata
└── __snapshots__/        // Test snapshots (being migrated to VRT)
```

**Common File Patterns:**

- `*.module.css` -- CSS Modules for component styling
- `*.test.tsx` -- Unit tests using Vitest and Testing Library
- `*.stories.tsx` -- Storybook stories for documentation and testing
- `*.docs.json` -- Component metadata for documentation generation

## CI/CD and Workflows

**Key GitHub Actions:**

- `.github/workflows/ci.yml` -- Main CI pipeline (format, lint, test, type-check, build)
- `.github/workflows/vrt.yml` -- Visual regression testing
- `.github/workflows/storybook-tests.yml` -- Storybook interaction tests

**The CI will fail if:**

- Code is not formatted (`npm run format` fixes this)
- Linting errors exist (`npm run lint:fix` auto-fixes many)
- TypeScript compilation fails
- Unit tests fail
- Build fails

## Quick Start Commands Summary

For agents working on this repository for the first time:

```bash
# 1. Check prerequisites
node --version
npm --version

# 2. Install and build (NEVER CANCEL - takes ~2-3 minutes total)
npm install     # ~5 seconds (or ~2 minutes clean)
npm run build   # ~90 seconds without cache

# 3. Start development
npm start       # Starts Storybook on http://localhost:6006

# 4. Run tests and checks
npm test                # ~75 seconds - unit tests
npm run type-check      # ~42 seconds - TypeScript validation
npm run lint            # ~73 seconds - code linting
npm run format:diff     # ~2 seconds - format checking

# 5. Before committing
npm run format          # Fix formatting
npm run lint:fix        # Auto-fix linting issues
```

## Known Issues and Workarounds

**Timing Expectations:**

- Fresh install: ~5 seconds (clean install: ~2 minutes)
- Full clean build: ~90 seconds (with turbo cache: ~1 second)
- Build all including examples: ~33 seconds
- Unit tests: ~75 seconds
- Type checking: ~42 seconds
- Linting: ~73 seconds
- CSS linting: ~6 seconds
- Format checking: ~2 seconds
- Storybook startup: ~3 seconds

**CRITICAL**: NEVER CANCEL builds, tests, or long-running commands. They may take significantly longer in CI environments. Always set appropriate timeouts (90+ minutes for builds/tests).
