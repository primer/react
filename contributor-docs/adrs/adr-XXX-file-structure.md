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
│  ├─ BreadCrumbs/
│  │  ├─ index.ts                    // Just re-exporting?
│  │  ├─ BreadCrumbs.tsx             // Primary component
│  │  ├─ BreadCrumbsItem.tsx         // Subcomponent (include item name for findability in most IDEs)
│  │  ├─ BreadCrumbs.mdx             // Documentation. Always .mdx, not .md
│  │  ├─ BreadCrumbs.stories.tsx
│  │  ├─ BreadCrumbs.test.tsx        // Unit tests
│  │  ├─ BreadCrumbs.types.test.tsx  // Type tests
│  │  ├─ BreadCrumbs.yml             // Component metadata (Possible future)
│  │  └─ __snapshots__/
┆  ┆
```

### Rules

- Every component should have its own PascalCased directory directly under `src/`
- Subcomponents meant to be used as children of their parent component should be properties of the exported component (e.g., `BreadCrumbs.Item`)
- Subcomponents meant to be used on their own should be exported as a named export (e.g., `ButtonDanger`)
- Replacements of existing components should use an incrementing number (e.g., `BreadCrumbs2` rather than `NewBreadCrumbs`)

## Implementation

- [ ] Migrate components into this structure
- [ ] Set up tests for the component structure
- [ ] Mark this ADR as adopted
