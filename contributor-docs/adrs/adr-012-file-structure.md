# ADR 12: File structure

## Status

Accepted

## Context

Components might be more grokable if they were structured consistently. This ADR proposes conventions

## Decision

TL;DR:

```
primer-react/
├─ src/
│  ├─ Breadcrumbs/
│  │  ├─ index.ts                    // Just re-exporting?
│  │  ├─ Breadcrumbs.tsx             // Primary component
│  │  ├─ BreadcrumbsItem.tsx         // Subcomponent (include parent component name to increase findability in most IDEs)
│  │  ├─ Breadcrumbs.mdx             // Documentation. Always .mdx, not .md
│  │  ├─ Breadcrumbs.stories.tsx
│  │  ├─ Breadcrumbs.test.tsx        // Unit tests
│  │  ├─ Breadcrumbs.types.test.tsx  // Type tests
│  │  ├─ Breadcrumbs.yml             // Component metadata (Possible future)
│  │  └─ __snapshots__/
┆  ┆
```

### Rules

- Every component should have its own PascalCased directory directly under `src/`
- Subcomponents should be properties of the exported parent component (e.g., `Breadcrumbs.Item`)
- Replacements of existing components should use an incrementing number (e.g., `Breadcrumbs2` rather than `NewBreadcrumbs`)

## Implementation

- [ ] Migrate components into this structure (as part of [Storybook refactor work](https://github.com/github/primer/issues/1488))
- [ ] Set up tests for the component structure
- [ ] Mark this ADR as adopted
