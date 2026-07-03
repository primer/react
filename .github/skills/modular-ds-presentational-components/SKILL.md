---
name: modular-ds-presentational-components
description: 'Use when: building or evaluating flexible, composable Primer React parts that consumers assemble directly, or deciding whether a pattern is ready to become a config component. Covers structure-first composition, pairing presentational components with behavior hooks, data-component attributes, sub-component export conventions, and when to promote a pattern up the spectrum.'
---

# Modular DS — Presentational Components

Presentational components are styled pieces that consumers compose directly. Primer still owns the styling, accessibility expectations, data attributes, and component contracts for each piece — consumers control layout, ordering, conditional rendering, and content.

```tsx
function Example({items}) {
  const [state, actions] = useList({defaultSelected: []})
  return (
    <List>
      {items.map(item => (
        <List.Item key={item.label} onClick={() => actions.toggleSelect(item.label)}>
          <List.ItemLeadingVisual>
            <List.ItemSelection selected={state.selected.has(item.label)} />
          </List.ItemLeadingVisual>
          <List.ItemLabel>{item.label}</List.ItemLabel>
        </List.Item>
      ))}
    </List>
  )
}
```

## When to use presentational components

- The pattern is **emerging** — it's known to exist, but the right high-level config API hasn't stabilized yet.
- Consumers need more flexibility than a config component's props surface can reasonably expose (variants, custom ordering, conditional rendering).

Presentational components are usually the starting point for a new component area — default to building these first, then add behavior through hooks, and only add a config component later once patterns and defaults are established (see `modular-ds-config-components`).

## Behavior via hooks

State and interactions are usually provided separately through a behavior/state hook, letting consumers choose how much behavior to adopt. Keep behavior hooks internal (not part of the public API) unless the requested API or a clear consumer need requires making them public — see `modular-ds-utilities` for hook conventions.

## Composition rules

- Compose via children (slots). Never use render props or `React.Children` + `React.cloneElement`.
- Use context (`use<Component>Context()`) for ARIA wiring between sub-components — never expose that context to consumers.
- Keep sub-components composable — don't bake one sub-component into another. For example, `Header` should accept `Title` and `CloseButton` as children rather than rendering `CloseButton` internally, so consumers control placement and omission.
- Use existing Primer components where appropriate (e.g. `Button`, `IconButton`, Octicons) instead of re-implementing native elements with custom styling.
- Use CSS Modules (`.module.css`) with Primer design tokens for styling, and `clsx` for className merging.

## `data-component` attributes

All presentational parts must include `data-component` attributes for stable selectors (testing, agents):

- Root: `data-component="ComponentName"`
- Sub-components: `data-component="ComponentName.PartName"`

`data-component` is owned by Primer as a component identifier — it must never be exposed as a customizable public prop.

## Sub-component export conventions

Flat exports (e.g. `DialogRoot`, `DialogHeader`, `DialogTitle`) are the goal for React Server Components compatibility — the `Object.assign` dot-notation pattern breaks in RSC (property access on a client reference returns `undefined`). Follow whichever convention existing components in the repo currently use for the area you're touching. If starting fresh, prefer flat named exports alongside a composed object for forward compatibility:

```ts
// Flat exports (RSC-safe)
export {Root as DialogRoot, Content as DialogContent, Header as DialogHeader}

// Composed export (convenience for non-RSC call sites)
export const DialogParts = Object.assign(Root, {Content, Header, Title})
```

## Accessibility semantics

Keep markup and accessibility semantics flexible. Preserve native semantics, including heading structure, and expose presentational pieces or slots when consumers need control over content, appearance, or semantics. Match the accessibility pattern to the component contract — for established ARIA Authoring Practices Guide patterns (e.g. accordions), prefer the APG semantics and structure over ad hoc native-element defaults. See `modular-ds-accessibility-contract` for the full responsibility matrix across API types.

## Promoting to a config component

As a pattern (e.g. a filtering behavior layered on top of presentational parts) becomes common and well-understood, consider moving it up the spectrum into a config component. Until then, the presentational API is the supported path — don't force premature abstraction.
