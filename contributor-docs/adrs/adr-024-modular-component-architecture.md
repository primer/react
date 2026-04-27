# Modular Component Architecture

📆 Date: 2026-04-27

## Status

| Stage          | State          |
| -------------- | -------------- |
| Status         | Proposed 🟡    |
| Implementation | In progress ⚠️ |

## Context

Primer React components are monolithic — each ships as a single unit mixing behavior, accessibility, styling, and composition into one API surface. This makes it difficult for consumers to:

- Use Primer accessibility and behavior logic without Primer's visual opinions
- Compose components from smaller, reusable parts
- Incrementally adopt Primer in codebases with existing design systems
- Override specific layers (e.g., styling) without forking the entire component

We need a layered architecture where each layer has a clear responsibility, a stable API contract, and can be used independently.

**Source issues:**

- [primer#6546](https://github.com/github/primer/issues/6546) — Layer definitions
- [core-ux#2270](https://github.com/github/core-ux/issues/2270) — Layer 2 composition pattern
- [core-ux#2272](https://github.com/github/core-ux/issues/2272) — Layer 3/4 prop-getters vs context
- [core-ux#2269](https://github.com/github/core-ux/issues/2269) — Export & package structure
- [core-ux#2271](https://github.com/github/core-ux/issues/2271) — Contracts between layers

## Decision

### Four layers

Every modular component is decomposed into four layers. Each layer builds on the one below.

| Layer | Name        | Responsibility                                        | Styled?                      |
| ----- | ----------- | ----------------------------------------------------- | ---------------------------- |
| 4     | Hooks       | Individual, single-purpose behavior                   | ❌ No markup or styles       |
| 3     | Foundations | Component-specific ARIA wiring + behavior composition | ❌ Unstyled (CSS reset only) |
| 2     | Parts       | Primer-styled JSX composition                         | ✅ Full Primer styles        |
| 1     | Ready-made  | Props-based convenience wrapper                       | ✅ Full Primer styles        |

Ready-made (L1) uses Parts (L2), Parts use Foundations (L3), Foundations use Hooks (L4).

### Layer 4 — Hooks

**Individual, single-purpose behavior hooks.** Not component-specific. Reusable across any component that needs the behavior.

Examples: `useFocusTrap`, `useFocusZone`, `useOnEscapePress`, `useScrollLock`

**API pattern:** Each hook takes options and returns refs, callbacks, or prop objects.

```tsx
const {containerRef} = useFocusZone({bindKeys: FocusKeys.ArrowVertical})
```

**Rules:**

- One behavior per hook — no compound hooks at this layer
- No knowledge of which component is consuming them
- No styling or markup opinions

### Layer 3 — Foundations

**Compound hooks returning prop-getters.** Component-specific. Wires up ARIA relationships, composes Layer 4 hooks, manages component lifecycle.

**Key rule:** Prop-getters are the public API. Context is an implementation detail only — consumers never call `useContext()` directly.

```tsx
// Foundation consumer — owns all markup
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
- Composable with any component system (Radix, custom, etc.)
- Multi-element wiring is natural (`getTitleProps()`, `getBodyProps()`)
- TypeScript return types are explicit and statically known
- No imposed component tree

**Foundation CSS:** Each foundation may ship a minimal CSS reset that removes browser defaults without adding visual opinion. Use `:where()` for zero specificity so consumer styles always win.

**Context** is allowed internally for ARIA cross-wiring (e.g., `aria-labelledby` pointing title ID to dialog) but is never exposed to consumers.

### Layer 2 — Parts (Composition)

**Styled JSX components for Primer-opinionated composition.**

**Composition via slots (`useSlots`):**

- Use slots (children-based) for all composition
- Render props exist only in legacy code — do not add new ones
- Context (e.g., `useDialogContext()`) replaces render-prop-injected IDs for ARIA wiring
- Never use `React.Children` + `React.cloneElement`

```tsx
// Parts consumer — Primer-styled, compositional
<DialogParts.Root open={open} onClose={onClose}>
  <DialogParts.Content width="large">
    <DialogParts.Header>
      <DialogParts.Title>Title</DialogParts.Title>
      <DialogParts.CloseButton />
    </DialogParts.Header>
    <DialogParts.Body>Content</DialogParts.Body>
    <DialogParts.Footer>
      <Button>Cancel</Button>
    </DialogParts.Footer>
  </DialogParts.Content>
</DialogParts.Root>
```

**Rules:**

- Parts use Foundations internally — they call `useComponentFoundation()` and spread prop-getters
- Parts add Primer design tokens, CSS modules, and layout opinions
- Parts are the building blocks for Ready-made (Layer 1)
- All Parts must include `data-component` attributes per [ADR-023](./adr-023-stable-selectors-api.md)

### Stable selectors (ADR-023)

All Layer 2 Parts and Layer 1 Ready-made components must include `data-component` attributes as defined in [ADR-023](./adr-023-stable-selectors-api.md).

**Rules:**

- Root component: `data-component="ComponentName"` (e.g., `data-component="Dialog"`)
- Sub-components match the React API: `data-component="ComponentName.PartName"` (e.g., `data-component="Dialog.Header"`)
- State and modifier attributes (`data-width`, `data-size`, `data-variant`) remain separate — they describe state, not identity
- Layer 3 (Foundations) does NOT add `data-component` — the consumer owns all markup
- Internal CSS may target `data-component` selectors using `:where()` for zero specificity

```html
<!-- Layer 2 example: all parts have stable identifiers -->
<dialog data-component="Dialog">
  <div data-component="Dialog.Content" data-width="large" data-position-regular="center">
    <header data-component="Dialog.Header">
      <h2 data-component="Dialog.Title">Title</h2>
      <button data-component="Dialog.CloseButton">✕</button>
    </header>
    <div data-component="Dialog.Body">Content</div>
    <footer data-component="Dialog.Footer">...</footer>
  </div>
</dialog>
```

### Layer 1 — Ready-made

**Props-based convenience API.** The simplest way to use a component — pass data, get a fully composed component.

```tsx
// Ready-made consumer — just props
<Dialog
  open={open}
  onClose={onClose}
  title="Confirm"
  footerButtons={[
    {buttonType: 'default', content: 'Cancel', onClick: onClose},
    {buttonType: 'primary', content: 'Save', onClick: onSave},
  ]}
>
  Are you sure you want to save?
</Dialog>
```

**Rules:**

- Ready-made is a thin wrapper over Parts — it composes `<Component.Root>`, `<Component.Header>`, etc.
- Props map directly to Parts children — no new behavior at this layer
- This is the default recommendation for most consumers

## Export & package structure

### Entry points

| Layer           | Stable import               | Experimental import                      |
| --------------- | --------------------------- | ---------------------------------------- |
| 1 — Ready-made  | `@primer/react`             | `@primer/react/experimental`             |
| 2 — Parts       | `@primer/react`             | `@primer/react/experimental`             |
| 3 — Foundations | `@primer/react/foundations` | `@primer/react/foundations/experimental` |
| 4 — Hooks       | `@primer/react/hooks`       | `@primer/react/hooks/experimental`       |

### Naming conventions

| Layer | Convention                 | Example                                  |
| ----- | -------------------------- | ---------------------------------------- |
| 4     | `use<Behavior>`            | `useScrollLock`, `useFocusTrap`          |
| 3     | `use<Component>Foundation` | `useDialogFoundation`                    |
| 2     | `<Component>Parts.<Part>`  | `DialogParts.Root`, `DialogParts.Header` |
| 1     | `<Component>`              | `Dialog`                                 |

### Rules

- `@primer/react` does NOT re-export Foundations or Hooks — each layer is opt-in via its own entry point
- All layers ship in one package version
- Stability is per-component — `useDialogFoundation` can graduate while others remain experimental
- Graduation = one-time import path change (`/experimental` → stable)

### Source folder structure

```
packages/react/src/
├── hooks/                     # Layer 4 (existing + new)
│   ├── useFocusTrap.ts
│   ├── useOnEscapePress.ts
│   └── useScrollLock.ts
├── foundations/               # Layer 3
│   └── experimental/
│       └── <Component>/
│           ├── use<Component>Foundation.ts
│           └── index.ts
├── experimental/              # Layer 2 + Layer 1 (while experimental)
│   └── <Component>/
│       ├── <Component>.tsx           # Parts (Layer 2)
│       ├── <ReadyMade>.tsx           # Ready-made (Layer 1)
│       ├── <Component>.module.css
│       ├── <Component>.spec.md       # Component specification
│       └── index.ts
└── <Component>/               # Layer 1 + 2 (after graduation)
    └── <Component>.tsx
```

### package.json exports (additions for new entry points)

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

## Alternatives considered

### Components instead of prop-getters for Layer 3

We considered shipping unstyled React components (like Radix primitives) at Layer 3. This was rejected because:

- It imposes a component tree — consumers must nest `<DialogTitle>` inside `<DialogRoot>`
- Harder to compose with non-React systems or existing component libraries
- Prop-getters give the consumer full control over every rendered element

### Context as public API

We considered exposing React Context for ARIA wiring (e.g., `useDialogContext()` to get title IDs). This was rejected because:

- It leaks implementation details and couples consumers to our component tree
- Prop-getters achieve the same wiring without requiring a specific provider hierarchy
- Context is still used internally — just not exposed to consumers

### Render props for Layer 2 composition

Render props were considered for Layer 2 but rejected:

- They already exist in legacy code — we don't want to add more
- Slots via `useSlots` are more declarative and composable
- `React.Children` + `React.cloneElement` are fragile and discouraged by React team

## Consequences

- Every new component should be built using this 4-layer decomposition
- Existing components can be incrementally migrated by extracting hooks and foundations
- Consumers get predictable, documented layers to adopt at their comfort level
- Breaking changes can be scoped to individual layers rather than entire components
- The first component through this architecture is Dialog — it serves as the reference implementation
