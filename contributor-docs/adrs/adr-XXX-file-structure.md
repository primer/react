# ADR XXX: File structure

## Status

Proposed

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
│  │  ├─ BreadcrumbsItem.tsx         // Subcomponent (include item name for findability in most IDEs)
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
- Subcomponents meant to be used as children of their parent component should be properties of the exported component (e.g., `Breadcrumbs.Item`)
- Subcomponents meant to be used on their own should be exported as a named export (e.g., `ButtonDanger`)
- Replacements of existing components should use an incrementing number (e.g., `Breadcrumbs2` rather than `NewBreadcrumbs`)

## Implementation

- [ ] Migrate components into this structure
- [ ] Set up tests for the component structure
- [ ] Mark this ADR as adopted
