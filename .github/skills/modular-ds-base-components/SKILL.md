---
name: modular-ds-base-components
description: 'Use when: building or evaluating unstyled Primer React primitives, especially accessibility primitives or low-level behavior that other components should build on. Covers when to create a base component instead of baking behavior into a styled component, the unstyled CSS-reset convention, deciding which parts need a base equivalent, and consolidating ARIA Authoring Practices Guide patterns.'
---

# Modular DS — Base Components

Base components are unstyled primitives used to build higher-level components. They carry no visual styling and enforce structural accessibility constraints, similar in spirit to [Base UI](https://base-ui.com/) or [Radix Primitives](https://www.radix-ui.com/primitives).

```tsx
function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger />
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  )
}
```

Other examples of things suited to base components: Combobox (filtering, selection), Listbox (selection), Popover, Tabs, Treeview.

Shown above with dot-notation for readability — ship flat named exports per the RSC-safe convention in `modular-ds-presentational-components`, not an `Object.assign` composed export.

## When to use a base component

Use base components for accessibility primitives and low-level behaviors that need full markup and style control. Before adding custom behavior to a component, look for an existing base component, hook, or utility that can already provide the foundation — don't reimplement it.

Accessibility primitives for established patterns (e.g. ARIA Authoring Practices Guide patterns) should be **consolidated and reused** rather than reimplemented across components. If you find yourself re-solving a pattern that already has a base component elsewhere in the repo, use it instead of writing a parallel implementation.

## What a base component covers

- Structural accessibility constraints (e.g. a title must be a descendant of a dialog).
- ARIA wiring via internal context, so consumers get correct semantics "for free" while retaining full markup control.
- No visual opinion at all — presentational components (see `modular-ds-presentational-components`) build on top and add Primer's design tokens and layout.

## Deciding which parts need a base equivalent

Not every presentational sub-part needs a base component. A base primitive earns its place when there's accessibility behavior or interactivity tied to it (e.g. a dialog root, a close control, an overlay). Purely structural parts — a label, a heading, a message wrapper — usually don't need one, since consumers can render their own markup and the surrounding base components continue to wire ARIA correctly via context.

When it's not obvious whether a given part warrants its own base component, surface the decision explicitly rather than assuming.

## CSS reset convention

Where a base component needs to remove browser defaults (e.g. native `<dialog>`/`<button>` styling) without adding visual opinion, ship a minimal CSS reset using `:where()` selectors so specificity stays at zero and consumer/presentational styles always win.

## Relationship to hooks

Base components wrap the compound behavior hook for their component (see `modular-ds-utilities`) — they are the thin, JSX-shaped API most consumers reach for, while the hook itself stays available directly for the rarer "I need full markup control, no wrapping component at all" case. Both are first-class; a base component should not duplicate behavior that already lives in its hook.
