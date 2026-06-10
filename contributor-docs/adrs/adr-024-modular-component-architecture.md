# Modular Component Architecture

📆 Date: 2026-04-27
📝 Updated: 2026-04-30

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
- [core-ux#2272](https://github.com/github/core-ux/issues/2272) — Layer 0/1 prop-getters vs context
- [core-ux#2269](https://github.com/github/core-ux/issues/2269) — Export & package structure
- [core-ux#2271](https://github.com/github/core-ux/issues/2271) — Contracts between layers

## Decision

### Four layers

Components are decomposed into layers, with each layer building on the one below. Not every component populates every layer — the four layers are a vocabulary for what's available, not a mandatory template. A layer (or a primitive within a layer) earns its place when there's demand for the control it exposes; symmetry across components isn't a reason on its own.

| Layer | Name        | Responsibility                                         | Styled?                      |
| ----- | ----------- | ------------------------------------------------------ | ---------------------------- |
| 0     | Hooks       | The component's compound behaviour hook (prop-getters) | ❌ No markup or styles       |
| 1     | Foundations | Unstyled accessible components that wrap the L0 hook   | ❌ Unstyled (CSS reset only) |
| 2     | Parts       | Primer-styled JSX composition that wraps L1            | ✅ Full Primer styles        |
| 3     | Ready-made  | Props-based convenience wrapper over L2                | ✅ Full Primer styles        |

Each layer is a thin wrapper over the one below. Ready-made (L3) wraps Parts (L2), Parts wrap Foundations (L1), Foundations (unstyled components) wrap the compound hook (L0).

**Layer 2 must wrap Layer 1.** If a Part can't be built by wrapping the L1 unstyled components — because some behaviour or structure is only reachable at L0 — stop and assess what L1 is missing, rather than reaching past it. A Part that needs to drop to L0 signals a gap in L1.

**Compose, don't depend.** A component may be _composed_ with another component by the consumer (e.g. SelectPanel alongside Tabs), but must not take a hard internal dependency on another component. Importing another component's parts or hooks to build this one is a smell — leave the composition to the consumer.

> **Open question — layer naming:** "Foundations" and "Parts" may not be the most intuitive names. Hooks (L0) and Ready-made (L3) are clear. Layer 1 candidates: primitives (conflicts with `primer/primitives` token package), base, headless, core. Layer 2 candidates: blocks, components, kit. Also unresolved: whether a component's name is shared across layers (imported from different entry points) or differs per layer. To be resolved.

### Layer 0 — Hooks (the compound behaviour hook)

**The component's compound behaviour hook** (`use<Component>` — e.g. `useDialog`, `useSelectPanel`). It owns all of the component's behaviour and ARIA, returns prop-getter functions, and renders no markup. Every layer above wraps it.

```tsx
const {getOverlayProps, getTitleProps, isOpen} = useDialog({open, onClose, role: 'dialog'})
```

**Rules:**

- One compound hook per component — it composes whatever Utilities it needs
- Returns prop-getters; no markup or styles
- Owns all ARIA wiring, lifecycle, and focus management

> **Utilities (outside the layer model):** generic, single-purpose, component-agnostic behaviour hooks — `useFocusTrap`, `useFocusZone`, `useOnEscapePress`, `useScrollLock`, `useFilter`, `useSelectionState` — are **not** a layer. They live in `packages/react/src/hooks/`, are reusable across any component, and are composed _inside_ the Layer 0 compound hook (or directly by consumers). This replaces the earlier framing that treated these generic hooks as "Layer 0".

### Layer 1 — Foundations (unstyled components)

Layer 1 is the set of **unstyled accessible components that wrap the Layer 0 hook**. They carry no visual styling, enforce structural accessibility constraints (ARIA wiring, focus management, keyboard interaction via context), and let consumers bring their own styles. Similar to [Base UI](https://base-ui.com/) or [Radix Primitives](https://www.radix-ui.com/primitives).

**Layer 1 is mandatory and is a thin wrapper over Layer 0.** The unstyled components are the familiar JSX API most consumers reach for; the L0 compound hook stays available directly for the rarer "I need full markup control" case. They are a _stack_ (L1 wraps L0), not two parallel APIs at one layer.

#### Unstyled components (primary Layer 1 API)

```tsx
// Foundation consumer — unstyled, bring your own CSS
<Dialog.Root open={open} onClose={onClose}>
  <Dialog.Content className={styles.popup}>
    <Dialog.Title className={styles.title}>Title</Dialog.Title>
    <Dialog.Description className={styles.desc}>Subtitle</Dialog.Description>
    <Dialog.Body className={styles.body}>Content</Dialog.Body>
    <Dialog.Close className={styles.close}>✕</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

Unstyled components enforce structural constraints that prop-getters cannot:

- Title must be a descendant of the dialog
- Close button is present and accessible
- ARIA relationships are wired automatically via context

**Scope — which parts get an unstyled variant:** Not every Part needs an unstyled equivalent at L1. An unstyled primitive earns a place when there's accessibility behaviour or interactivity tied to it (e.g. `Dialog.Root`, `Dialog.Close`, an unstyled `SelectPanel.Overlay`). Structural-only parts — a label, a heading, a message wrapper — don't, since consumers can render their own markup and the L1 components around them continue to wire ARIA correctly via context. An unstyled `SelectPanel.Message` that reduces to a `<p>` adds API surface without adding control.

**Foundation CSS:** Each foundation ships a minimal CSS reset that removes browser defaults without adding visual opinion. This can be implemented via CSS cascade layers (preferred — clearer intent) or `:where()` selectors (zero specificity fallback). Consumer styles always win regardless of approach.

#### Compound hook (escape hatch)

For consumers who need full control over every rendered element — no component tree imposed.

```tsx
// Hook consumer — owns all markup
const dialog = useDialog({open, onClose})

<dialog {...dialog.getDialogProps()}>
  <h2 {...dialog.getTitleProps()}>Title</h2>
  <p {...dialog.getDescriptionProps()}>Subtitle</p>
  <div {...dialog.getBodyProps()}>Content</div>
  <button {...dialog.getCloseProps()}>✕</button>
</dialog>
```

**Why both approaches:**

- Unstyled components cover the common case: "I want Primer's accessibility, but my own styles." They enforce a11y constraints and are self-documenting in JSX.
- The compound hook covers the advanced case: "I need full markup control." Useful for integrating with other component systems (MUI, custom libraries) or building non-standard layouts.
- This matches the industry standard: Base UI and React Aria ship unstyled components, with hooks as the lower-level escape hatch.

**Context** is used internally within unstyled components for ARIA cross-wiring (e.g., `aria-labelledby` pointing title ID to dialog) but is never exposed to consumers.

### Layer 2 — Parts (Composition)

**Styled JSX components for Primer-opinionated composition.**

**Composition via slots (`useSlots`):**

- Use slots (children-based) for all composition
- Render props exist only in legacy code — do not add new ones
- Context (e.g., `useDialogContext()`) replaces render-prop-injected IDs for ARIA wiring
- Never use `React.Children` + `React.cloneElement`

```tsx
// Parts consumer — Primer-styled, compositional
<DialogRoot open={open} onClose={onClose}>
  <DialogContent width="large">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>Content</DialogBody>
    <DialogFooter>
      <Button>Cancel</Button>
    </DialogFooter>
  </DialogContent>
</DialogRoot>
```

**Rules:**

- Parts wrap Layer 1 unstyled components and add Primer design tokens, CSS modules, and layout opinions
- Parts are the building blocks for Ready-made (Layer 3)
- All Parts must include `data-component` attributes per [ADR-023](./adr-023-stable-selectors-api.md)

### Stable selectors (ADR-023)

All Layer 2 Parts and Layer 3 Ready-made components must include `data-component` attributes as defined in [ADR-023](./adr-023-stable-selectors-api.md).

**Rules:**

- Root component: `data-component="ComponentName"` (e.g., `data-component="Dialog"`)
- Sub-components match the React API: `data-component="ComponentName.PartName"` (e.g., `data-component="Dialog.Header"`)
- State and modifier attributes (`data-width`, `data-size`, `data-variant`) remain separate — they describe state, not identity
- Layer 1 (Foundations) does NOT add `data-component` — the consumer owns styling and may choose their own selectors
- Internal CSS may target `data-component` selectors using `:where()` for zero specificity

> **Open question:** With compositional parts available, is `data-component` still necessary at Layer 2, or is `className` sufficient? `data-component` serves testing and agent selectors (stable across refactors), which is a different concern from styling. To be resolved.

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

### Layer 3 — Ready-made

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

- Ready-made is a thin wrapper over Parts — it composes `<DialogRoot>`, `<DialogHeader>`, etc.
- Props map directly to Parts children — no new behavior at this layer
- This is the default recommendation for most consumers
- **Not every component needs a Ready-made layer.** Config-based APIs can lead to unwieldy types (e.g., SelectPanel). The Ready-made layer should capture the 80% use case. If a component's common usage is inherently compositional, Layer 2 may be the right default and Layer 3 adds complexity without benefit. Decide per component.

## Accessibility contract by layer

Each layer shifts accessibility responsibility to the consumer differently. This table defines what each layer handles automatically and what the consumer must provide.

| Requirement                            | L0 (Hooks)           | L1 (Foundations)                   | L2 (Parts)        | L3 (Ready-made)         |
| -------------------------------------- | -------------------- | ---------------------------------- | ----------------- | ----------------------- |
| `role="dialog"` / `role="alertdialog"` | Consumer sets        | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited            |
| `aria-modal="true"`                    | Consumer sets        | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited            |
| `aria-labelledby` → title              | Consumer wires       | ✅ Auto-wired via context          | ✅ Inherited      | ✅ From `title` prop    |
| `aria-describedby` → description       | Consumer wires       | ✅ Auto-wired if Description used  | ✅ Inherited      | ✅ From `subtitle` prop |
| Focus trapping                         | Consumer implements  | ✅ Native `showModal()`            | ✅ Inherited      | ✅ Inherited            |
| Escape closes dialog                   | Consumer handles     | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited            |
| Focus moves into dialog                | Consumer manages     | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited            |
| Focus returns on close                 | Consumer manages     | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited            |
| Visible close button                   | Consumer provides    | ✅ Enforced by component structure | ✅ Built-in       | ✅ Built-in             |
| Background inert                       | Consumer manages     | ✅ Native `showModal()`            | ✅ Inherited      | ✅ Inherited            |
| Scroll lock                            | `useScrollLock` hook | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited            |
| Visible backdrop                       | Consumer provides    | ⚠️ Consumer must style             | ✅ Primer token   | ✅ Primer token         |
| Appropriate heading level              | Consumer chooses     | ⚠️ Consumer must choose            | ✅ `<h2>` default | ✅ `<h2>` default       |
| Colour contrast                        | Consumer responsible | ⚠️ Consumer must ensure            | ✅ Primer tokens  | ✅ Primer tokens        |

> **Important:** At Layer 1, the foundation ships a transparent backdrop by default. Per ARIA APG, `aria-modal="true"` should only be set when background content is **both** non-interactive and visually obscured. Consumers using Layer 1 foundations **must** provide visible backdrop styling to meet this requirement. Layer 2 Parts handle this automatically.

**`aria-describedby` guidance:** Per ARIA APG, omit `aria-describedby` when dialog content has complex semantic structure (lists, tables, multiple paragraphs) — screen readers announce it as a flat string. At Layer 1+, don't render the Description component if content is complex. At Layer 0, don't call `getDescriptionProps()`.

**Initial focus guidance:** For dialogs with complex semantic content, set `initialFocusRef` to a static element at the top with `tabIndex={-1}` so assistive technology users can navigate the structure. For destructive actions, focus the least destructive button. See the [ARIA APG dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for full guidance.

## Export & package structure

### Entry points

> **Open question — entry point strategy:** An alternative to separate entry points (`/foundations`, `/hooks`) is using an `unstable_` prefix convention and importing from the same package entry point. This is simpler for consumers — fewer paths to remember. To be resolved with Primer Engineering.

| Layer                                        | Stable import               | Experimental import                      |
| -------------------------------------------- | --------------------------- | ---------------------------------------- |
| Ready-made (L3) + Parts (L2)                 | `@primer/react`             | `@primer/react/experimental`             |
| Foundations — L0 compound hook + L1 unstyled | `@primer/react/foundations` | `@primer/react/foundations/experimental` |
| Utilities (generic hooks, outside model)     | `@primer/react/hooks`       | `@primer/react/hooks/experimental`       |

### Naming conventions

> **Open question — hook naming:** The Layer 0 compound hook should be named by its role, not its layer — `useDialog`, not `useDialogFoundation`. The "Foundation" suffix is an internal architectural concept, not a consumer-facing concern.

| Layer                      | Convention                                          | Example                       |
| -------------------------- | --------------------------------------------------- | ----------------------------- |
| Utilities (outside model)  | `use<Behaviour>`                                    | `useScrollLock`, `useFilter`  |
| 0 — Compound hook          | `use<Component>`                                    | `useDialog`, `useSelectPanel` |
| 1 — Foundations (unstyled) | flat `<Component><Part>` (see naming open question) | `DialogRoot`                  |
| 2 — Parts                  | `<Component><Part>`                                 | `DialogRoot`, `DialogHeader`  |
| 3 — Ready-made             | `<Component>`                                       | `Dialog`                      |

**Sub-component naming: flat exports.** All Layer 2 and Layer 1 sub-components use flat named exports (`DialogRoot`, `DialogHeader`, `DialogTitle`, etc.) rather than dot-notation (`Dialog.Root`, `Dialog.Header`). This is required for RSC compatibility — the `Object.assign` pattern creates dot-notation sub-components that break in React Server Components (property access on a client reference returns `undefined`). Flat imports are already the pattern Tabs uses in Primer.

Layer 2 and Layer 1 share the same component names. The entry point determines which you get:

- `import { DialogRoot } from '@primer/react'` → Primer-styled (Layer 2)
- `import { DialogRoot } from '@primer/react/foundations'` → unstyled (Layer 1)

### Rules

- `@primer/react` does NOT re-export Foundations or Hooks — each layer is opt-in via its own entry point
- All layers ship in one package version
- Stability is per-component — `useDialog` can graduate while others remain experimental
- Graduation = one-time import path change (`/experimental` → stable)

### Source folder structure

```
packages/react/src/
├── hooks/                     # Layer 0 (existing + new)
│   ├── useFocusTrap.ts
│   ├── useOnEscapePress.ts
│   └── useScrollLock.ts
├── foundations/               # Layer 1
│   └── experimental/
│       └── <Component>/
│           ├── <Component>.tsx           # Unstyled components
│           ├── use<Component>.ts         # Compound hook (prop-getters)
│           ├── <Component>Foundation.css  # Minimal CSS reset
│           └── index.ts
├── experimental/              # Layer 2 + Layer 3 (while experimental)
│   └── <Component>/
│       ├── <Component>.tsx           # Parts (Layer 2)
│       ├── <ReadyMade>.tsx           # Ready-made (Layer 3)
│       ├── <Component>.module.css
│       ├── <Component>.spec.md       # Component specification
│       └── index.ts
└── <Component>/               # Layer 3 + 2 (after graduation)
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

### Prop-getters only for Layer 1 (no unstyled components)

Initially considered shipping only compound hooks with prop-getters at Layer 1 (inspired by [Downshift](https://www.downshift-js.com/)). This was revised because:

- It creates too large a gap between Layer 2 (fully styled components) and Layer 1 (raw hook, build all JSX from scratch)
- Prop-getters cannot enforce structural accessibility constraints (e.g., title must be a descendant of the dialog)
- The industry standard for this layer (Base UI, Radix Primitives, React Aria Components) ships unstyled components, with hooks as a lower-level escape hatch
- The compound hook is retained alongside unstyled components for consumers who need full markup control

### Context as public API

We considered exposing React Context for ARIA wiring (e.g., `useDialogContext()` to get title IDs). This was rejected because:

- It leaks implementation details and couples consumers to our component tree
- Prop-getters achieve the same wiring without requiring a specific provider hierarchy
- Context is still used internally within Layer 1 unstyled components — just not exposed to consumers

### Render props for Layer 2 composition

Render props were considered for Layer 2 but rejected:

- They already exist in legacy code — we don't want to add more
- Slots via `useSlots` are more declarative and composable
- `React.Children` + `React.cloneElement` are fragile and discouraged by React team

## Consequences

- New components are designed against this layered architecture, populating the layers that have demand
- Existing components can be incrementally migrated by extracting hooks and foundations
- Consumers get predictable, documented layers to adopt at their comfort level
- Breaking changes can be scoped to individual layers rather than entire components
- The first component through this architecture is Dialog — it serves as the reference implementation
- Each layer requires an accessibility checklist documenting what the consumer is responsible for
