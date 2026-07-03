---
name: modular-ds-spectrum-model
description: "Use when: deciding how to structure a new Primer React component, evaluating whether an existing component's API is at the right level of abstraction, or orienting on the modular design system approach before using a more specific modular-ds-* skill. Covers the spectrum of abstraction model (config, presentational, base, utility components), when each API type is appropriate, and how they compose."
---

# Modular DS — Spectrum of Abstraction Model

Primer authors components across a spectrum of abstraction rather than a single fixed shape. Start with flexible presentational components and companion behavior hooks. As opinions or defaults become established, build config components that compose those presentational components and hooks instead of duplicating their behavior.

This is deliberately **not** a mandatory layer stack every component must populate. Not every component needs its own config API, and not every component needs its own hooks — start with presentational components and add the other API types only when there's real demand for the control they expose.

## The four API types

| API type                  | Use for                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Config components         | Ready-made, props-based components for stable product patterns and common use-cases |
| Presentational components | Styled pieces that consumers compose directly, often with companion behavior hooks  |
| Base components           | Unstyled primitives, often for accessibility structure or low-level behavior        |
| Utilities                 | Hooks, state management, behaviors, and functions used to build components          |

See the dedicated skill for each API type for detailed rules:

- `modular-ds-config-components`
- `modular-ds-presentational-components`
- `modular-ds-base-components`
- `modular-ds-utilities`

For accessibility ownership across API types, see `modular-ds-accessibility-contract`. For breaking an existing monolithic component into this model, see `modular-ds-decompose-existing-component`.

## How the API types relate

Presentational components are usually accompanied by a behavior or state hook for the component's core functionality. Config components are then built by composing presentational components with the corresponding behavior/state hooks — config components should not duplicate behavior that already exists at the presentational + utility level.

Base components sit underneath presentational components as unstyled primitives (accessibility structure, low-level behavior). Before adding custom behavior to a component, look for an existing base component, hook, or utility that already provides the foundation, rather than reimplementing it.

### Worked example

A `List` config component might support selection as its default interaction:

```tsx
<List items={[{label: 'Item one'}, {label: 'Item two'}]} onSelect={item => {}} />
```

If a team needs filtering that the config API doesn't support, they build on the presentational `List` parts plus a lower-level behavior hook (e.g. `useCombobox`) instead of forking the config component or asking it to support every variation:

```tsx
function FilterableList({items}) {
  const {getInputProps, getListboxProps, getOptionProps} = useCombobox({items, selectionMode: 'multiple'})
  return (
    <Stack>
      <Filter {...getInputProps({'aria-label': 'Filter items'})} />
      <List {...getListboxProps()}>
        {items.map(item => (
          <List.Item key={item.label} {...getOptionProps({item})}>
            <List.ItemLabel>{item.label}</List.ItemLabel>
          </List.Item>
        ))}
      </List>
    </Stack>
  )
}
```

The `List` parts continue to provide structure while the team layers filtering on top. If that filtering behavior becomes common and well-understood, it can move up the spectrum into the config component later.

## Deciding which API types a component needs

There's no single mechanical test for this yet, but one useful signal: does the state have a clear component that owns it? For a `List` with selection, there are two valid options:

- Bake selection into the `List` component (the config approach), or
- Provide a `useSelection`/`useList` hook that composes with presentational `List` parts (the presentational + utility approach)

When a decision isn't obvious — for example, whether a component needs a config API at all, or whether a sub-part needs its own base component — surface the decision explicitly rather than assuming an answer.

## Scope

This applies to how Primer authors and extends components generally, not just brand-new ones. Existing components (e.g. SelectPanel, Dialog) may need changes to fit this model over time; see `modular-ds-decompose-existing-component` when working on an existing component rather than starting fresh.
