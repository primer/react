---
name: slots
description: 'Use when: building, modifying, or wrapping compound components that use child-component "slots" in Primer React. Covers when to add a `__SLOT__` marker, the `useSlots` hook, the `isSlot` helper, the `asSlot` wrapper helper, naming conventions for slot symbols, and common pitfalls.'
---

# Slots in Primer React

Primer React uses a lightweight, SSR-compatible slot system to let compound components extract specific child elements (e.g. `<ActionList.Item>` extracting `<ActionList.LeadingVisual>` out of its children). This skill documents the conventions and the public API surface.

## TL;DR

- **Building a compound component that needs to find specific children?** Use `useSlots(children, config)`.
- **Building a slot sub-component?** Add a `__SLOT__ = Symbol('Parent.Slot')` marker so it can be wrapped by consumers.
- **Wrapping an existing slot component?** Use `asSlot(wrapper, ParentSlotComponent)` to copy the marker.
- **Branching on whether a child is a slot, outside of `useSlots`?** Use `isSlot(child, SlotComponent)`.

All four primitives are exported publicly from `@primer/react`.

## Architecture

| File                   | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `hooks/useSlots.ts`    | Hook that extracts named slot children from `children`         |
| `utils/is-slot.ts`     | `isSlot(element, slot)` predicate                              |
| `utils/as-slot.ts`     | `asSlot(component, source)` marker-copy helper                 |
| `utils/types/Slots.ts` | `SlotMarker`, `WithSlotMarker<T>`, `FCWithSlotMarker<P>` types |

### Public exports

```ts
import {useSlots, isSlot, asSlot, type SlotMarker, type WithSlotMarker, type FCWithSlotMarker} from '@primer/react'
// or
import {useSlots} from '@primer/react/hooks'
```

## When to use slots

Slots are the right tool when:

- A parent compound component needs to **extract specific named children** and render them in particular positions (e.g. `Dialog.Header`, `Dialog.Body`, `Dialog.Footer`).
- The extraction must **survive SSR** (you can't rely on refs or rendered DOM).
- Consumers should be able to **wrap your slot sub-components** without breaking the parent's matching.

Slots are **not** the right tool when:

- You just want to render `children` as-is.
- You need to find _all_ children of a given type (`useSlots` is single-match-per-key — see "Limitations").
- You need to inspect grandchildren or do per-child transforms with side effects (see `ActionMenu` for the pattern when you have to).

## Building a slot consumer (parent component)

Use `useSlots`. It returns `[slots, rest]`, where `slots` is keyed by your config and `rest` is everything else (in encounter order).

```tsx
import {useSlots} from '@primer/react/hooks'

function MyCompound({children}: {children: React.ReactNode}) {
  const [slots, rest] = useSlots(children, {
    header: MyCompound.Header,
    footer: MyCompound.Footer,
  })

  return (
    <div>
      {slots.header}
      <div className="body">{rest}</div>
      {slots.footer}
    </div>
  )
}
```

### Matcher styles

```ts
useSlots(children, {
  // 1. Component reference (most common)
  header: Header,

  // 2. Component + props test fn (variant matching)
  block: [Description, props => props.variant === 'block'],
})
```

Each slot key produces `ReactElement | undefined`. Slots are single-match: the first matching child wins; duplicates emit a dev-mode warning.

## Building a slot sub-component (child component)

Add a `__SLOT__` symbol after the component declaration so wrappers and parent scanners can recognise it. Use `Parent.Slot` for the symbol description and the `WithSlotMarker` / `FCWithSlotMarker` types for the export.

```tsx
import type {FCWithSlotMarker} from '@primer/react'

export const MyHeader: FCWithSlotMarker<MyHeaderProps> = (props) => { ... }
MyHeader.displayName = 'MyCompound.Header'
MyHeader.__SLOT__ = Symbol('MyCompound.Header')
```

For `forwardRef`'d or otherwise non-FC components, assert with `WithSlotMarker<typeof Component>`:

```tsx
;(MyHeader as WithSlotMarker<typeof MyHeader>).__SLOT__ = Symbol('MyCompound.Header')
```

## Naming conventions for `Symbol(...)` descriptions

The Symbol description shows up in React DevTools and crash logs. Keep it predictable:

| Component shape                                     | Convention                      | Example                                                                      |
| --------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| Sub-component of a compound                         | `Symbol('Parent.Slot')`         | `Symbol('ActionList.LeadingVisual')`                                         |
| Root component used as a child of another component | `Symbol('Component')`           | `Symbol('FormControl')` (FormControl is scanned as a child by CheckboxGroup) |
| Deeply nested slot                                  | `Symbol('Parent.Slot.SubSlot')` | `Symbol('ActionList.GroupHeading.TrailingAction')`                           |

**Don't:**

- Use lifecycle annotations (`Symbol('DEPRECATED_X')`) — handle deprecation via other means.
- Use camelCase without separators (`Symbol('ActionListItem')` instead of `Symbol('ActionList.Item')`).
- Add a `__SLOT__` marker to a root component that no other component scans for — the marker is dead weight and confusing for anyone searching the codebase.

## Should I add a `__SLOT__` marker at all?

Add it when **either**:

1. **A parent in this codebase scans for it** (use `grep "isSlot.*ComponentName"` to check), or
2. **The component is a documented compound sub-component** (e.g. `Dialog.Header`) that consumers may want to wrap. Sub-component markers are intentionally generous because wrapping is a common downstream pattern.

Don't add it to top-level root components unless they're explicitly used as a child somewhere (e.g. `FormControl` is, because `CheckboxGroup` scans for it).

## Wrapping a slot component (`asSlot`)

When consumers wrap a Primer slot component, the wrapper must carry the same `__SLOT__` marker for the parent scanner to recognise it. Use `asSlot`:

```tsx
import {asSlot, ActionList} from '@primer/react'

const ColoredLeadingVisual = asSlot(
  function ColoredLeadingVisual({color, children}: {color: string; children: React.ReactNode}) {
    return (
      <ActionList.LeadingVisual>
        <span style={{color}}>{children}</span>
      </ActionList.LeadingVisual>
    )
  },
  ActionList.LeadingVisual,
)

// Now ActionList.Item recognises ColoredLeadingVisual as a leading visual slot.
<ActionList.Item>
  <ColoredLeadingVisual color="red"><CheckIcon /></ColoredLeadingVisual>
  Approved
</ActionList.Item>
```

`asSlot` is the preferred replacement for the older cast-heavy pattern:

```tsx
// ❌ Old, footgun-prone
;(ColoredLeadingVisual as typeof ColoredLeadingVisual & {__SLOT__?: symbol}).__SLOT__ =
  ActionList.LeadingVisual.__SLOT__

// ✅ New, typed, dev-warns if the source has no marker
const ColoredLeadingVisual = asSlot(ColoredLeadingVisual, ActionList.LeadingVisual)
```

## Branching on slot membership (`isSlot`)

If you need to check whether an element matches a particular slot outside of `useSlots` (e.g. inside an existing `Children.map` with side effects), use `isSlot`:

```tsx
import {isSlot} from '@primer/react'

React.Children.map(children, child => {
  if (React.isValidElement(child) && isSlot(child, Tooltip)) {
    // ...
  }
})
```

`isSlot` matches by comparing `__SLOT__` markers (on the element or its `type`), so it recognises both the original slot component and any wrapper created with `asSlot`. It does not compare component identity (`child.type === Tooltip`) directly — that works incidentally only because the original component carries the same marker symbol.

## Limitations and follow-ups

- **`useSlots` is single-match.** It cannot collect _all_ children of a given type into an array. Consumers that need that pattern (e.g. `UnderlinePanels` collecting all `Tab` children, `CheckboxGroup` collecting all `FormControl` children) currently hand-roll the logic. A future extension to `useSlots` may add a multi-match option.
- **Per-child classification / side-effect transforms** (e.g. `ActionMenu` rewriting Tooltip-wrapped Anchors) are not a slot pattern — keep them as bespoke `Children.map` loops with `isSlot` predicates.
- **Avoid calling `useSlots` purely for dev-mode warnings** in render-hot paths. Although `useSlots` is implemented as a plain function (no internal React hooks), running it on every render just to compute a dev-only assertion is wasteful — call it in the regular render flow when you also need its output.
- **Don't call `useSlots` inside `useMemo`, `useCallback`, `useEffect`, or any other callback.** The `react-hooks/rules-of-hooks` lint rule enforces this based on the `use*` naming convention, even though `useSlots` itself doesn't call any React hooks. Always call it at the top level of your component or custom hook. If you need to extract slots before a memoised computation, call `useSlots` first and then reference the result inside `useMemo`.

## Dev-mode warnings emitted by `useSlots`

- **Duplicate slot:** if two children match the same slot key, only the first is rendered and a warning fires.
- **`displayName` mismatch:** if a child's `displayName` matches a slot component's `displayName` but the child is missing the `__SLOT__` marker, a warning fires suggesting `asSlot`. This catches the most common wrapping footgun.

## Quick checklist for a new compound component

1. Define the sub-components (`MyCompound.Header`, etc.) with `displayName` set and `__SLOT__ = Symbol('MyCompound.Header')` applied.
2. In the parent, call `useSlots(children, {header: MyCompound.Header, ...})` once and render `slots.header` / `rest` in the right places.
3. Export `MyCompound` with `Object.assign(Root, {Header, Footer, ...})`.
4. Don't add `__SLOT__` to the root unless another component scans for it.
5. If the new component will be wrapped downstream, document that consumers should use `asSlot` (or call out which slot to pass).
