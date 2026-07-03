---
name: modular-ds-config-components
description: 'Use when: building or evaluating a props-based, "all-in-one" Primer React component for an established, stable pattern. Covers when config components are appropriate, opinionated defaults, the props-driven customization surface, escape hatches to presentational components, and composing rather than duplicating behavior.'
---

# Modular DS — Config Components

Config components are "all-in-one" APIs that let consumers describe intent through props or data rather than composing markup directly.

```tsx
<List
  items={[{label: 'Item one'}, {label: 'Item two'}, {label: 'Item three'}]}
  onSelect={item => {
    /* ... */
  }}
/>
```

## When to use a config component

- The pattern is a **stable product pattern** — Primer understands it well and expects many teams to reuse it.
- Common use-cases and opinionated defaults have already become clear, usually because a presentational + utility version of the same pattern already exists and has stabilized.

Don't reach for a config API for emerging or unstable patterns — see `modular-ds-presentational-components` for those instead. Config components should typically be *built by composing* presentational components and behavior hooks, not by reimplementing structure or behavior from scratch.

## What a config component owns

- **Opinionated defaults** for structure, behavior, accessibility, styling, and interaction patterns.
- **Integrated behavior** — state management, keyboard behavior, selection, filtering, validation, etc. are usually bundled in rather than left to the consumer.
- **A fast path** for teams that want to implement an established pattern quickly and correctly.

## What a config component must not do

- Try to support every variation through props. Limited flexibility is by design — unusual needs should drop down to presentational components instead of growing the config API indefinitely.
- Duplicate behavior, state, or markup that already exists in the presentational components and hooks it composes.
- Expose `data-component` as a customizable prop. Primer owns `data-component` values as component identifiers, at every API type.

## Customization surface

Extension happens only through supported props, slots, render props, or configuration — never through arbitrary internal composition. When consumers need to change structure, semantics, or behavior beyond what the config API exposes, the clear escape boundary is to move to the presentational components and behavior hooks underneath (see `modular-ds-presentational-components`).

## Styling

Don't invent visual styling without a concrete design reference, image, or specification. If styling isn't specified, keep styles minimal and structural so the component API and accessibility model can be evaluated independently of visual polish.

## Refs and typing

Prefer `HTMLElement` for default root refs and polymorphic component typing. Use narrower element types only when the API or behavior genuinely requires a specific element.

## Adoption surfaces

When shipping or changing a config component's public API, include: source exports, tests, stories, docs metadata, and a changeset when published package behavior changes.
