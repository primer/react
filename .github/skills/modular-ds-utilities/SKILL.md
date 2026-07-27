---
name: modular-ds-utilities
description: "Use when: extracting, reusing, or naming hooks, state management, or other component-agnostic behavior in Primer React, or when a component's behavior hook wraps a native element with built-in behavior such as `<dialog>`. Covers the compound behavior-hook pattern (prop-getters), the controlled component contract for wrapping native elements, the difference between a component's own hook and a generic reusable utility, naming conventions, and where utilities live in the package."
---

# Modular DS — Utilities

Utilities are hooks, functions, behaviors, and other reusable logic used to build components. Primer provides utility hooks for established patterns so teams can build accessible experiences on solid foundations — examples include `useMergedRefs`, `useOnEscapePress`, and `useResponsiveValue`, or lower-level packages such as `@primer/behaviors`.

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

// The root calls the hook once and publishes the getters via context.
function DialogRoot({children, ...options}: DialogRootProps) {
  const dialog = useDialog(options)
  return (
    <DialogContext.Provider value={dialog}>
      <div {...dialog.getRootProps()}>{children}</div>
    </DialogContext.Provider>
  )
}

// Descendant parts read those getters — they never call useDialog() again.
function DialogTitle(props: DialogTitleProps) {
  const {getTitleProps} = useDialogContext()
  return <h2 {...getTitleProps()} {...props} />
}
```

**Generic, single-purpose, component-agnostic utilities** (e.g. `useFocusTrap`, `useFocusZone`, `useMergedRefs`, `useOnEscapePress`, `useResponsiveValue`) are not tied to any one component. They live in `packages/react/src/hooks/`, and a component's compound hook composes them internally as needed. Search `packages/react/src/hooks/` for an existing utility before writing a new one — don't duplicate behavior that already exists as a shared hook, and don't assume a plausibly-named hook exists without checking.

## Controlled component contract

When a compound hook wraps a native element that has its own built-in behavior — `<dialog>` being the obvious case — the hook must keep the component fully controlled. The native element will otherwise change state behind React's back. These invariants are easy to get subtly wrong and expensive to debug:

1. **Opening** — call `showModal()` only when `open === true` and `dialog.open === false`.
2. **Closing** — call `dialog.close()` only when `open === false` and `dialog.open === true`.
3. **Escape handling** — intercept the native `cancel` event, call `preventDefault()`, and fire `onClose('escape')` rather than letting the native close proceed.
4. **Close guard** — listen for the native `close` event. If `open` is still `true` but the element was closed externally (someone called `dialog.close()` directly), re-open it.
5. **Backdrop click detection** — the `<dialog>` backdrop is the element's own area outside its content box, so a backdrop click still targets the dialog. Check `e.target === dialog` to confirm the click wasn't on a child, then verify the coordinates fall outside the content box rect.
6. **Focus lifecycle** — save `document.activeElement` before opening, and restore focus to `returnFocusRef` or the previously-focused element on close.

Together these ensure the component can only be opened or closed through the `open` prop and `onClose` callback. Apply the same reasoning to any other native element with built-in state (`<details>`, `<select>`, popover-attribute elements): identify what the browser changes on its own, and intercept it.

## Naming

Name a component's compound hook `use<Component>`. Before naming, search the repo for existing hooks with the same name — legacy hooks (e.g. `src/hooks/useDialog.ts`) may already exist and conflict. If a conflict exists, the new compound hook takes the `use<Component>` name and the legacy hook should be documented as deprecated (see the `deprecations` skill).

## Public vs internal hooks

Do not expose public hooks for sub-component internals unless there's a clear consumer need. Internal hooks are fine when they keep behavior reusable without expanding the public API — pairing a presentational component with a behavior hook doesn't mean every internal behavior hook should become a package export. If a hook is made public, it needs docs metadata and tests matching its API surface, the same as any other public API change.

## Where utilities live

- Component-specific compound hooks: alongside their component, e.g. `packages/react/src/experimental/<Component>/use<Component>.ts`. If the component's base parts end up under a `foundations/` directory, the hook goes with them — note that `packages/react/src/foundations/` does not exist yet and would need creating.
- Generic, component-agnostic utilities: `packages/react/src/hooks/`, never inside one component's own directory.

Presentational and config components currently live under `packages/react/src/experimental/<Component>/` until they graduate to stable — check where the component's area already sits before creating new directories.
