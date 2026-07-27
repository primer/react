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

Shown above with dot-notation for readability — see "Sub-component export conventions" below for the actual RSC-safe export shape to ship.

## When to use presentational components

- The pattern is **emerging** — it's known to exist, but the right high-level config API hasn't stabilized yet.
- Consumers need more flexibility than a config component's props surface can reasonably expose (variants, custom ordering, conditional rendering).

Presentational components are usually the starting point for a new component area — default to building these first, then add behavior through hooks, and only add a config component later once patterns and defaults are established (see `modular-ds-config-components`).

## Behavior via hooks

State and interactions are usually provided separately through a behavior/state hook, letting consumers choose how much behavior to adopt. Keep behavior hooks internal (not part of the public API) unless the requested API or a clear consumer need requires making them public — see `modular-ds-utilities` for hook conventions.

## Composition rules

- Prefer ordinary React children over render props or `React.Children` + `React.cloneElement` for presentational composition. `cloneElement` in particular is fragile and breaks when consumers wrap children. Render props remain a legitimate extension point where a config component genuinely needs them (see `modular-ds-config-components` and `contributor-docs/style.md`) — this is a default, not a prohibition.
- Don't reach for the slots system by default. `useSlots` and `__SLOT__` markers are for the narrow case where a parent must identify a specific child part or extract a child out of the tree — not a general composition mechanism. Prefer plain children first, and only introduce slots when the requested API genuinely needs child extraction. See the `slots` skill for the mechanics if you do.
- Preserve consumer-authored child order. A presentational component should never reorder the children it's given — document the recommended structure instead.
- Use context (`use<Component>Context()`) for ARIA wiring between sub-components — never expose that context to consumers.
- Keep sub-components composable — don't bake one sub-component into another. For example, `Header` should accept `Title` and `CloseButton` as children rather than rendering `CloseButton` internally, so consumers control placement and omission.
- Use existing Primer components where appropriate (e.g. `Button`, `IconButton`, Octicons) instead of re-implementing native elements with custom styling. Where a component needs Primer-owned button semantics, interaction behavior, and reset styling, build on a shared primitive such as `ButtonBase` rather than hand-rolling a button reset in CSS. When you do, don't pass opinionated layout or variant props through to that primitive unless the component's own API exposes the choice, or a concrete design reference requires it — otherwise you're hard-coding an appearance decision the consumer can't reach.
- Use CSS Modules (`.module.css`) with Primer design tokens for styling, and `clsx` for className merging.

## `data-component` attributes

All presentational parts must include `data-component` attributes for stable selectors (testing, agents):

- Root: `data-component="ComponentName"`
- Sub-components: `data-component="ComponentName.PartName"`

`data-component` is owned by Primer as a component identifier — it must never be exposed as a customizable public prop.

`data-component` is identity, not a styling hook. Never write CSS that selects on it — least of all another component's, which couples your styles to markup that component is free to change. Per ADR-023 (`contributor-docs/adrs/adr-023-stable-selectors-api.md`), the DOM around a `data-component` element — its parent, children, siblings and attributes — is explicitly **not** public API, so a component may target its own parts but never reach into another component's. Values are PascalCase `ComponentName.PartName`, not camelCase. Wrap `data-*` state and ARIA state selectors in `:where()` so they stay at zero specificity and don't outrank a base component's reset.

A `data-*` state attribute must mean the same thing on every part of a component that carries it. If a part needs a derived or inverted value — a separator in a horizontal toolbar being drawn vertically, say — give it a differently-named attribute rather than reusing the parent's under an opposite meaning. These attributes are the stable selector surface, so two parts one DOM level apart disagreeing about what `data-orientation` means is a trap for every consumer who writes a descendant selector.

## Sub-component export conventions

Flat exports (e.g. `DialogRoot`, `DialogHeader`, `DialogTitle`) are the goal for React Server Components compatibility — the `Object.assign` dot-notation pattern breaks in RSC (property access on a client reference returns `undefined`). Follow whichever convention existing components in the repo currently use for the area you're touching. If starting fresh, ship flat named exports only — add a composed `Object.assign` object solely to preserve an existing dot-notation API, never on a new component, where it buys nothing and adds an RSC trap to the public surface permanently:

```ts
// Flat exports (RSC-safe) — the default for anything new
export {Root as DialogRoot, Content as DialogContent, Header as DialogHeader}

// Composed export — only to preserve an existing dot-notation API
export const DialogParts = Object.assign(Root, {Content, Header, Title})
```

Base and presentational parts for the same component intentionally share `<Component><Part>` names across their different entry points — don't prefix or rename base parts to avoid the clash. A file importing both aliases one at the import site. Note this applies to exported **types** as well as components: `AccordionItemProps` will mean structurally different things depending on the entry point, and TypeScript error messages won't disambiguate them, so alias deliberately.

## Accessibility semantics

Keep markup and accessibility semantics flexible. Preserve native semantics, including heading structure, and expose presentational pieces when consumers need control over content, appearance, or semantics — via plain children composition, per the composition rules above. Match the accessibility pattern to the component contract — for established ARIA Authoring Practices Guide patterns (e.g. accordions), prefer the APG semantics and structure over ad hoc native-element defaults. See `modular-ds-accessibility-contract` for the full responsibility matrix across API types.

## Promoting to a config component

As a pattern (e.g. a filtering behavior layered on top of presentational parts) becomes common and well-understood, consider moving it up the spectrum into a config component. Until then, the presentational API is the supported path — don't force premature abstraction.
