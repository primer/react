---
applyTo: '**/*.ts,**/*.tsx'
---

# Project coding standards for TypeScript and React

Apply the [general coding guidelines](./general-coding.instructions.md) to all code.

## General Conventions

- After making a change to a file, use `npx eslint --fix` with a path to the file changed to make sure the code lints

## TypeScript Guidelines

- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators

## React Guidelines

- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Keep components small and focused
- Use CSS modules for component styling

## Storybook Guidelines

- Put the default component stories alongside the component (for most components this is `packages/react/src/[ComponentName]/[ComponentName].stories.tsx`)
- Include `Default` and `Playground` stories in the default stories file when the component supports configurable controls
- Use the `Components/[ComponentName]` Storybook title for the default stories file
- Put feature-specific stories alongside the component (for most components this is `packages/react/src/[ComponentName]/[ComponentName].features.stories.tsx`)
- Use the `Components/[ComponentName]/Features` Storybook title for feature stories
- Put examples or scenario-based stories in separate files, such as `[ComponentName].examples.stories.tsx`, when they are distinct from core feature coverage
