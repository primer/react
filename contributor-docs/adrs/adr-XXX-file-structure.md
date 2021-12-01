# ADR XXX: Isolating behaviors through custom clements and vanilla JavaScript

## Status

Proposed

## Context

Components might be more grokable if they were structured consistently

## Decision

```
primer-react/
├─ src/
│  ├─ BreadCrumbs/
│  │  ├─ index.ts                    // Just re-exporting?
│  │  ├─ BreadCrumbs.tsx             // Primary component
│  │  ├─ BreadCrumbsItem.tsx         // Subcomponent
│  │  ├─ BreadCrumbs.mdx             // Documentation. Always .mdx, not .md
│  │  ├─ BreadCrumbs.stories.tsx
│  │  ├─ BreadCrumbs.test.tsx
│  │  └─ BreadCrumbs.types.test.tsx
┆  ┆
```

Questions I would like to settle in this ADR:

- On subcomponents:
  - Do subcomponents filenames need to be namespaced with the parent component? (e.g., `BreadCrumbsItem.tsx` vs `Item.tsx`)
  - Should the `index.ts` in each component directory export every subcomponent under its own name, or should we prefer `Object.assign`ing subcomponents to the parent component?
  - Should subcomponents always have their own test files? What about type tests and stories?
- Would this structure help if we wanted to move toward one-package-per-component like react-aria does?
- Could we set a standard for replacement components? E.g., NewButton vs. Button2
