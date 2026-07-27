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
function useDialog(options: {
  open: boolean
  onClose: (reason: 'escape' | 'close-button') => void
  role?: 'dialog' | 'alertdialog'
  'aria-label'?: string
}) {
  const titleId = useId()
  const [hasTitle, setHasTitle] = useState(false)
  // A title part registers itself on mount, so the root knows whether
  // `aria-labelledby` has anything real to point at.
  const registerTitle = useCallback((node: HTMLElement | null) => setHasTitle(node !== null), [])

  return {
    getRootProps: () => ({
      role: options.role ?? 'dialog',
      'aria-modal': true,
      // Only ever return keys you have a value for — see "Getters must not return keys
      // they have no value for" below. `aria-labelledby` is gated on a title actually
      // being registered: it outranks `aria-label` in the accessible name computation,
      // so returning it unconditionally would point the name at an element that never
      // rendered *and* suppress the `aria-label` fallback.
      ...(hasTitle
        ? {'aria-labelledby': titleId}
        : options['aria-label'] !== undefined && {'aria-label': options['aria-label']}),
    }),
    getTitleProps: () => ({id: titleId, ref: registerTitle}),
    getCloseProps: (userProps: {onClick?: React.MouseEventHandler} = {}) => ({
      ...userProps,
      onClick: composeEventHandlers(userProps.onClick, () => options.onClose('close-button')),
    }),
  }
}

// The root calls the hook once and publishes the getters via context. Hook options are
// destructured explicitly so everything else still reaches the DOM.
function DialogRoot({children, open, onClose, role, 'aria-label': ariaLabel, ...rest}: DialogRootProps) {
  const dialog = useDialog({open, onClose, role, 'aria-label': ariaLabel})
  return (
    <DialogContext.Provider value={dialog}>
      <div {...rest} {...dialog.getRootProps()}>
        {children}
      </div>
    </DialogContext.Provider>
  )
}

// A merge-signature getter is the one exception to spreading rest props before the
// getter: hand the consumer's value *to* the getter instead. Spreading `onClick`
// before `getCloseProps()` would let the getter's own handler overwrite it, which is
// the clobber this whole section exists to prevent.
function DialogCloseButton({onClick, ...rest}: DialogCloseButtonProps) {
  const {getCloseProps} = useDialogContext()
  return <button {...rest} {...getCloseProps({onClick})} />
}

// Descendant parts read those getters — they never call useDialog() again.
function DialogTitle(props: DialogTitleProps) {
  const {getTitleProps} = useDialogContext()
  return <h2 {...props} {...getTitleProps()} />
}
```

**Spread prop-getters last, everywhere.** A getter only returns the attributes it owns, so consumer rest props still reach the DOM — `className`, `data-testid` and the like are never in the getter's return value and pass straight through, satisfying `contributor-docs/style.md`'s rule about applying rest parameters to the root element. Putting the getter last additionally means a consumer can't silently overwrite generated ARIA: no stray `role`, `aria-modal`, `aria-labelledby` or `id` clobbering the wiring and leaving the component with an accessible name pointing at an element that doesn't exist.

There's one rule rather than two on purpose — an agent shouldn't have to classify a component as "root" or "part" before it can pick a spread order.

**The one exception is a merge-signature getter.** Where a getter takes the consumer's value as an argument, pass it in rather than spreading it beforehand — `{...rest} {...getCloseProps({onClick})}`, not `{...rest} {...getCloseProps()}` with `onClick` still in `rest`. A merge getter always returns the key it merges, so spreading the consumer's handler before it would let the getter's own handler overwrite theirs, which is the exact failure the spread-last rule exists to prevent. Destructure the merged prop out of `rest` explicitly, as `DialogCloseButton` does above, so it can't reach the element by both routes.

**Getters must not return keys they have no value for.** This is the other half of spreading last, and omitting it turns that rule into an accessibility bug. A key present with the value `undefined` still overwrites — `{...{'aria-labelledby': 'heading'}, ...{'aria-labelledby': undefined}}` leaves the key present and valueless, and React then omits the attribute entirely. So a getter that returns every optional attribute unconditionally will **delete** whatever the consumer put on the element, silently. Build optional attributes conditionally so a getter only ever owns attributes it actually sets:

```ts
...(ariaLabel !== undefined && {'aria-label': ariaLabel}),
```

This matters most on a public hook, where the consumer owns the element and a dev-mode warning that inspects hook options rather than the DOM will not catch it.

Where a consumer legitimately needs to influence a generated value, make it a **hook option** (`role` and `aria-label` above), not something they override on the element. Where a consumer needs to _add to_ a getter-owned value rather than replace it — most commonly an `onClick` alongside the hook's own handler — give that getter a **merge signature** that composes the two, as `getCloseProps` does. There's no shared `composeEventHandlers` utility in the package today; `experimental/Tabs/Tabs.tsx` defines a local one. Prefer following that precedent with your own local copy. Lifting it into `packages/react/src/hooks/` is reasonable now a second component needs it, but it edits a shipped component that your change is not otherwise about — so if you do, call it out in the PR description as a separate concern rather than letting it ride along unmentioned.

**Generic, single-purpose, component-agnostic utilities** (e.g. `useFocusTrap`, `useFocusZone`, `useMergedRefs`, `useOnEscapePress`, `useResponsiveValue`) are not tied to any one component. They live in `packages/react/src/hooks/`, and a component's compound hook composes them internally as needed. Search `packages/react/src/hooks/` for an existing utility before writing a new one — don't duplicate behavior that already exists as a shared hook, and don't assume a plausibly-named hook exists without checking. Note in particular that for state a consumer can control or leave uncontrolled, `contributor-docs/style.md` calls for `useControllableState` — reach for it rather than hand-rolling the controlled/uncontrolled split, and rather than the older `useProvidedStateOrCreate` that appears in more of the existing codebase.

Components that render a **collection** may need per-item prop-getters keyed by a stable value (`getItemProps({value})`) rather than the argument-less getters above, which are shaped for singleton components. The discriminator is what the hook owns: reach for per-item getters where it owns per-item state or identity (selection, expansion, active descendant), and don't where it owns only container-level behaviour such as focus management or orientation — there the items are the consumer's own controls and the hook should never address them individually. The key's shape is a decision to surface, not one to assume.

## Precedent in the repo: `experimental/Tabs`

`packages/react/src/experimental/Tabs/` is the closest existing implementation of this model and the thing you're most likely to copy. Copy its composition, not its hook shape — it predates the rules above and diverges from them in four ways:

- It has **per-part hooks** (`useTab`, `useTabList`, `useTabPanel`) that each call `useTabs()` internally, rather than one compound hook whose getters descendants read from context.
- Those hooks return **plain prop objects** (`tabProps`), not getter functions.
- All three are **public** from `@primer/react/experimental` with no `hookDocs.json`, which is below the bar above on both counts.
- `useTab.ts:38` returns `'aria-disabled': disabled ? true : undefined` and `Tabs.tsx:64-65` spreads it last — a live instance of the clobber described above. A consumer passing `aria-disabled` to a `Tab` has it silently dropped.

What Tabs does get right, and is worth copying: rest props before generated props, explicit `composeEventHandlers` for the handlers it needs to merge, and context rather than `cloneElement`.

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

Do not expose public hooks for sub-component internals unless the need **cannot be met by the presentational parts**. That is the bar, and it's deliberately narrower than "a clear consumer need" — a requirement to control layout, ordering or arrangement is met by composition, since the presentational parts already accept arbitrary children in arbitrary structure. That alone never justifies a public hook. A public hook is only necessary when the consumer must own and render the root element itself. Internal hooks are fine when they keep behavior reusable without expanding the public API — pairing a presentational component with a behavior hook doesn't mean every internal behavior hook should become a package export. If in doubt, keep it internal and note in the PR that it can be exported on request: this is the narrower, reversible option in the sense `modular-ds-spectrum-model` describes, and a public hook is the textbook irreversible one. If a hook is made public, it needs docs metadata and tests matching its API surface, the same as any other public API change — the repo convention for the metadata is a `use<Component>.hookDocs.json` file alongside the hook (see `hooks/useFocusZone.hookDocs.json`), and a component's `.docs.json` does not cover it. Public hooks are also bound by the getter rules above, which a consumer now depends on directly.

## Where utilities live

- Component-specific compound hooks: alongside their component, e.g. `packages/react/src/experimental/<Component>/use<Component>.ts`, shipping from the same entry point as that component's parts. Where a component has base parts, the hook goes with them; where it has none, it ships with the presentational parts. If base parts later move to a `foundations/` directory, the hook moves with them — note that `packages/react/src/foundations/` does not exist yet, and creating it is not something to do as part of a component change (see below).
- Generic, component-agnostic utilities: `packages/react/src/hooks/`, never inside one component's own directory.

Neither `@primer/react/foundations` nor `@primer/react/hooks` exists as an **export subpath** — `packages/react/package.json` currently exposes `.`, `./experimental`, `./deprecated`, `./next` and `./test-helpers`. This is a statement about subpaths, not directories: `packages/react/src/hooks/` does exist, and several of its hooks are already published from the **root** entry point. `packages/react/src/foundations/` exists as neither. Adding a new export subpath is a package-level decision, not part of building a component — **surface it and stop**. Do not add an `exports` entry to `packages/react/package.json`, a rolldown entry point, or an exports-snapshot update as part of a component change. Until a subpath exists, ship base components and compound hooks under `packages/react/src/experimental/<Component>/` alongside the presentational parts, and note in the PR that they'll move once the entry point lands.

Presentational and config components currently live under `packages/react/src/experimental/<Component>/` until they graduate to stable — check where the component's area already sits before creating new directories.
