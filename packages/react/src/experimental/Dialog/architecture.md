# Modular Component Architecture — Decisions

> **Source issues:**
> - [primer#6546](https://github.com/github/primer/issues/6546) — Layer definitions
> - [core-ux#2270](https://github.com/github/core-ux/issues/2270) — Layer 2 composition pattern
> - [core-ux#2272](https://github.com/github/core-ux/issues/2272) — Layer 3/4 prop-getters vs context
> - [core-ux#2269](https://github.com/github/core-ux/issues/2269) — Export & package structure
> - [core-ux#2271](https://github.com/github/core-ux/issues/2271) — Contracts between layers

## Layer Definitions

| Layer | Name | Import | API shape | Styled? |
|-------|------|--------|-----------|---------|
| 1 | Ready-made | `@primer/react` | Props-based — pass data, get a component | ✅ Full Primer styles |
| 2 | Parts | `@primer/react` | JSX composition — `<Component.Header>` | ✅ Full Primer styles |
| 3 | Foundations | `@primer/react/foundations` | Prop-getters — consumer controls markup | ❌ Unstyled (CSS reset only) |
| 4 | Hooks | `@primer/react/hooks` | Individual behavior hooks | ❌ No markup or styles |

Each layer builds on the one below. Ready-made uses Parts, Parts use Foundations, Foundations use Hooks.

## Layer 4 — Hooks

**Individual, single-purpose behavior hooks.** Not component-specific.

Examples: `useFocusTrap`, `useFocusZone`, `useOnEscapePress`, `useScrollLock`

These already exist in `packages/react/src/hooks/`. New hooks go there too.

**API pattern:** Each hook takes options and returns refs, callbacks, or prop objects.
```tsx
const {containerRef} = useFocusZone({bindKeys: FocusKeys.ArrowVertical})
```

## Layer 3 — Foundations

**Compound hooks returning prop-getters.** Component-specific, wires up ARIA relationships.

Source: [core-ux#2272](https://github.com/github/core-ux/issues/2272)

**Key rule:** Prop-getters are the public API. Context is an implementation detail only — consumers never call `useContext()` directly.

```tsx
// Layer 3 public API
const dialog = useDialogFoundation({open, onClose})

<dialog {...dialog.getDialogProps()}>
  <h2 {...dialog.getTitleProps()}>Title</h2>
  <p {...dialog.getDescriptionProps()}>Subtitle</p>
  <div {...dialog.getBodyProps()}>Content</div>
  <button {...dialog.getCloseProps()}>✕</button>
</dialog>
```

**Why prop-getters over components:**
- Full markup ownership — consumer chooses every element
- Composable with any component system (MUI, Radix, custom)
- Multi-element wiring is natural (`getTitleProps()`, `getBodyProps()`)
- TypeScript return types are explicit and statically known
- No imposed component tree

**Context is allowed internally** for ARIA cross-wiring (e.g., `aria-labelledby` pointing title ID to dialog) but is never exposed to consumers.

## Layer 2 — Parts (Composition)

**Slots via `useSlots` — the preferred pattern.**

Source: [core-ux#2270](https://github.com/github/core-ux/issues/2270)

- Use slots (children-based) for all composition
- Render props exist only in legacy code — do not add new ones
- Context (e.g., `useDialogContext()`) replaces render-prop-injected IDs for ARIA wiring
- Never use `React.Children` + `React.cloneElement`

```tsx
// Layer 2 consumer API
<Dialog.Root open={open} onClose={onClose}>
  <Dialog.Content width="large">
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.CloseButton />
    </Dialog.Header>
    <Dialog.Body>Content</Dialog.Body>
    <Dialog.Footer>
      <Button>Cancel</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## Export & Package Structure

Source: [core-ux#2269](https://github.com/github/core-ux/issues/2269)

### Entry points

| Layer | Import path | Experimental path |
|-------|------------|-------------------|
| 1 — Ready-made | `@primer/react` | `@primer/react/experimental` |
| 2 — Parts | `@primer/react` | `@primer/react/experimental` |
| 3 — Foundations | `@primer/react/foundations` | `@primer/react/foundations/experimental` |
| 4 — Hooks | `@primer/react/hooks` | `@primer/react/hooks/experimental` |

### Naming conventions

| Layer | Convention | Example |
|-------|-----------|---------|
| 4 | `use<Behavior>` | `useScrollLock`, `useFocusTrap` |
| 3 | `use<Component>Foundation` | `useDialogFoundation` |
| 2 | `<Component>.<Part>` | `Dialog.Header`, `Dialog.Body` |
| 1 | `<Component>` | `Dialog` |

### Rules

- `@primer/react` does NOT re-export Foundations or Hooks — each layer is opt-in
- All layers ship in one package version
- Stability is per-component — `DialogFoundation` can graduate while others remain experimental
- Graduation = one-time import path change (`/experimental` → stable)

### Source folder structure

```
packages/react/src/
├── hooks/                     # Layer 4 (existing + new)
│   ├── useFocusTrap.ts        # existing
│   ├── useOnEscapePress.ts    # existing
│   └── useScrollLock.ts       # new
├── foundations/               # Layer 3 (new)
│   └── experimental/
│       └── Dialog/
│           ├── useDialogFoundation.ts
│           └── index.ts
├── experimental/
│   └── Dialog/                # Layer 2 (new parts) + spec
│       ├── Dialog.spec.md
│       ├── Dialog.tsx         # Parts (Layer 2)
│       └── index.ts
└── Dialog/                    # Layer 1 (existing, will wrap Layer 2)
    └── Dialog.tsx
```

### package.json exports (proposed additions)

```json
{
  "./foundations/experimental": {
    "types": "./dist/foundations/experimental/index.d.ts",
    "default": "./dist/foundations/experimental/index.js"
  },
  "./hooks/experimental": {
    "types": "./dist/hooks/experimental/index.d.ts",
    "default": "./dist/hooks/experimental/index.js"
  }
}
```
