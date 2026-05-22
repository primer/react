---
name: display-name
description: 'Use when: authoring or reviewing a component in Primer React, deciding whether to set `displayName`, and choosing the right string for it. Covers the criteria (when it''s needed vs redundant), the canonical naming convention, and interaction with the slot system.'
---

# `displayName` in Primer React

`Component.displayName` controls how the component appears in React DevTools, error stacks, and the slot system's dev-mode warnings. This skill documents when to set it, when not to, and how to name it.

## TL;DR

- **Set `displayName` whenever the runtime function name doesn't match the canonical name you want users to see** — i.e. compound sub-components (`Banner.PrimaryAction`) or `forwardRef` wrappers around anonymous arrow functions.
- **Skip `displayName` when the function/variable name already matches the canonical name.** Modern React + bundlers infer it from `Function.name` and assigning to a `const`. Adding `X.displayName = 'X'` is noise.
- **Always use `Parent.Slot` dot notation** for sub-components, never camelCase concatenation (`TimelineItem` ❌, `Timeline.Item` ✅).

## When to set `displayName`

Set it in these cases:

### 1. Compound sub-components where the function name doesn't match the canonical name

```tsx
// The function/variable name is the bare slot name, but DevTools should
// show the dot-notation compound name.
function Visual(...) { ... }
Visual.displayName = 'Blankslate.Visual'

const SegmentedControlButton = forwardRef(...)
SegmentedControlButton.displayName = 'SegmentedControl.Button'

const Panel = (...) => ...
Panel.displayName = 'SelectPanel'  // exported as `SelectPanel`, not `Panel`
```

### 2. `forwardRef` (or `memo`) wrapping an anonymous arrow function

```tsx
// ❌ Without displayName, DevTools shows "ForwardRef"
// (variable-name inference works in React 18+ but is unreliable under minification).
const Octicon = React.forwardRef((props, ref) => ...)
Octicon.displayName = 'Octicon'
```

### 3. Sub-components in the slot system

The slot system's dev-mode `displayName`-mismatch warning compares `child.type.displayName` against the slot component's `displayName`. Wrappers built with `asSlot` inherit the marker; setting an explicit `displayName` on each slot sub-component keeps the warning useful even when the wrapper's `Function.name` is generic.

## When you can skip `displayName`

Skip it in these cases — adding it is pure noise:

### 1. Named function components whose name matches the canonical name

```tsx
// ✅ `Function.name === 'Pagehead'` already; DevTools picks it up.
export function Pagehead({...}) { ... }
// No displayName needed.

// Same for arrow functions assigned to a const:
export const VisuallyHidden = ({...}) => { ... }
// `VisuallyHidden.name === 'VisuallyHidden'` via variable-name inference.
```

### 2. `forwardRef` with a named inner function whose name matches

```tsx
// ✅ React 18+ uses the inner function name.
const Label = React.forwardRef(function Label(props, ref) { ... })
// No displayName needed.
```

### 3. `forwardRef` wrapping a `const` whose name matches (in React 18+)

```tsx
// In React 18 + modern bundlers, DevTools infers "Select" from the const assignment.
const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => ...)
// Skip displayName for the root, BUT set it on Select.Option / Select.OptGroup if
// those wrap something whose name differs.
```

> Caveat: under aggressive minification (terser `keep_fnames: false`), `Function.name` becomes a short hash. If you ship a minified bundle and want DevTools to remain accurate in production builds, you can set `displayName` defensively. Primer's published build does not currently minify function names, so we treat `displayName` as optional in the cases above.

## Naming convention

| Component shape | Convention | Example |
|---|---|---|
| Top-level (root) component | `'ComponentName'` | `'Dialog'`, `'ActionList'` |
| Sub-component of a compound | `'Parent.Slot'` | `'Dialog.Header'`, `'PageLayout.Pane'` |
| Nested sub-component | `'Parent.Slot.SubSlot'` | `'ActionList.GroupHeading.TrailingAction'` |

### Don't

- `'TimelineItem'` — use `'Timeline.Item'`.
- `'BannerPrimaryAction'` — use `'Banner.PrimaryAction'`.
- `'ParentLink'` (PageHeader) — use `'PageHeader.ParentLink'`.
- `'DEPRECATED_Tooltip'` or lifecycle annotations — handle deprecation via JSDoc/changesets, not the symbol/displayName.
- `'My-Component'` (kebab-case) or `'my.component'` (lowercase) — always PascalCase tokens separated by dots.

### Match the `Symbol(...)` description

If the component has a `__SLOT__` marker, the `Symbol(...)` description **must match** the `displayName`. The slot system's `displayName`-mismatch warning depends on this contract:

```tsx
Header.displayName = 'Dialog.Header'
Header.__SLOT__ = Symbol('Dialog.Header')
```

See the `slots` skill for more on the slot system.

## Checklist for a new compound component

1. Top-level component: usually skip `displayName` — let the function name carry through.
2. Each sub-component (e.g. `Foo.Bar`, `Foo.Baz`):
   - Set `Sub.displayName = 'Foo.Bar'` after the declaration.
   - If it's a slot sub-component, also set `Sub.__SLOT__ = Symbol('Foo.Bar')` with the matching description.
3. If you use `forwardRef`/`memo` with an anonymous arrow inner function, either:
   - Promote to a named inner: `forwardRef(function Foo(props, ref) { ... })`, or
   - Set `Foo.displayName = 'Foo'` explicitly.

## Quick decision tree

```
Is the function/variable name already the same as the canonical name?
├── Yes  → Is it forwardRef(arrow)?
│         ├── Yes (anonymous inner)  → Set displayName
│         └── No (named or const)    → Skip; DevTools infers
└── No   → Always set displayName (and match any __SLOT__ Symbol)
```
