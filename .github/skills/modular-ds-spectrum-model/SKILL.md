---
name: modular-ds-spectrum-model
description: "Use when: deciding how to structure a new Primer React component, evaluating whether an existing component's API is at the right level of abstraction, or orienting on the modular design system approach before using a more specific modular-ds-* skill. Covers how the four API types (config, presentational, base, utilities) relate and compose, and how to decide which ones a component needs. The model itself is defined in contributor-docs/style.md."
---

# Modular DS — Spectrum of Abstraction Model

`contributor-docs/style.md` is the source of truth for this model. Read "Prefer building components across a spectrum of abstraction" first — it defines the four API types (config, presentational, base, utilities), when each one is appropriate, and, importantly, that this is not a mandatory stack every component must populate. This skill and its siblings carry the operational detail for applying that model, not a second definition of it.

See the dedicated skill for each API type for detailed rules:

- `modular-ds-config-components`
- `modular-ds-presentational-components`
- `modular-ds-base-components`
- `modular-ds-utilities`

For accessibility ownership across API types, see `modular-ds-accessibility-contract`. For what to test at each API type, see `modular-ds-testing`.

## How the API types relate

Presentational components are usually accompanied by a behavior or state hook for the component's core functionality. Config components are then built by composing presentational components with the corresponding behavior/state hooks — config components should not duplicate behavior that already exists at the presentational + utility level.

Base components sit underneath presentational components as unstyled primitives (accessibility structure, low-level behavior). Before adding custom behavior to a component, look for an existing base component, hook, or utility that already provides the foundation, rather than reimplementing it.

### Worked example

The `List` component below is **illustrative only** — neither it nor the hooks named in it exist in the repo today. Don't import them; verify any hook you plan to use, per `modular-ds-utilities`.

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

style.md gives the signal to start from: whether the state has a component that clearly owns it.

When a decision isn't obvious — for example, whether a component needs a config API at all, or whether a sub-part needs its own base component — surface the decision explicitly rather than assuming an answer. Surfacing it means shipping the **narrower, reversible** option and asking, not shipping the expansive one and noting the question afterwards. Adding a public export, a new part, or a new entry point is easy to do and hard to undo; leaving it out costs nothing and can be granted the moment someone asks.

## Scope

This applies to how Primer authors and extends components generally, not just brand-new ones. Existing components (e.g. SelectPanel, Dialog) may need changes to fit this model over time. Primer hasn't reshaped one under this model yet, so when the work is an existing component rather than a fresh start, keep the public API identical and surface the structural decisions rather than assuming a procedure.
