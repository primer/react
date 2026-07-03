---
name: modular-ds-utilities
description: "Use when: extracting, reusing, or naming hooks, state management, or other component-agnostic behavior in Primer React. Covers the compound behavior-hook pattern (prop-getters), the difference between a component's own hook and a generic reusable utility, naming conventions, and where utilities live in the package."
---

# Modular DS — Utilities

Utilities are hooks, functions, behaviors, and other reusable logic used to build components. Primer provides utility hooks for established patterns so teams can build accessible experiences on solid foundations — examples include `useMergedRefs`, `useOnEscapePress`, and `useTimeout`, or lower-level packages such as `@primer/behaviors`.

Utilities are not a layer or a wrapper in a stack — they're shared helpers that a component's own behavior hook, or a consumer directly, composes as needed.

## Two kinds of hooks — don't conflate them

**A component's own compound behavior hook** (`use<Component>` — e.g. `useDialog`, `useSelectPanel`) owns that component's behavior and ARIA, and returns prop-getter functions that consumers spread onto their own elements (`getDialogProps()`, `getTitleProps()`, etc.). It:

- Takes an options object with the component's behavioral configuration.
- Handles all ARIA wiring internally (generating IDs, cross-referencing `aria-labelledby`/`aria-describedby`).
- Manages lifecycle (open/close, focus management, scroll lock, etc.).
- Fires a dev-mode warning if required accessibility attributes are missing (see `modular-ds-accessibility-contract`).
- Passes through `aria-label` when provided, for cases without a visible title.

Shape of a compound hook returning prop-getters, consumed by a base component:

```tsx
function useDialog(options: {open: boolean; onClose: () => void; 'aria-label'?: string}) {
  const titleId = useId()
  return {
    getRootProps: () => ({role: 'dialog', 'aria-modal': true, 'aria-label': options['aria-label']}),
    getTitleProps: () => ({id: titleId}),
    getCloseProps: () => ({onClick: options.onClose}),
  }
}

// A context provider (rendered once by DialogRoot) calls useDialog() and shares its
// getters via context. Base components below it read those getters, they don't call the hook again:
function DialogRoot({children, ...props}: DialogRootProps) {
  const {getRootProps} = useDialogContext()
  return <div {...getRootProps()}>{children}</div>
}
```

**Generic, single-purpose, component-agnostic utilities** (`useScrollLock`, `useFocusTrap`, `useFocusZone`, `useFilter`, `useSelectionState`) are not tied to any one component. They live in `packages/react/src/hooks/`, and a component's compound hook composes them internally as needed. Check for an existing utility before writing a new one — don't duplicate behavior that already exists as a shared hook.

## Naming

Name a component's compound hook `use<Component>`. Before naming, search the repo for existing hooks with the same name — legacy hooks (e.g. `src/hooks/useDialog.ts`) may already exist and conflict. If a conflict exists, the new compound hook takes the `use<Component>` name and the legacy hook should be documented as deprecated (see the `deprecations` skill).

## Public vs internal hooks

Do not expose public hooks for sub-component internals unless there's a clear consumer need. Internal hooks are fine when they keep behavior reusable without expanding the public API — pairing a presentational component with a behavior hook doesn't mean every internal behavior hook should become a package export. If a hook is made public, it needs docs metadata and tests matching its API surface, the same as any other public API change.

## Where utilities live

- Component-specific compound hooks: alongside their component (e.g. `foundations/experimental/<Component>/use<Component>.ts`).
- Generic, component-agnostic utilities: `packages/react/src/hooks/`, never inside one component's own directory.
