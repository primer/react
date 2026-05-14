# ADR 024: Design System API Spectrum

📆 Date: TODO

## Status

| Stage          | State       |
| -------------- | ----------- |
| Status         | Proposed ❓ |
| Implementation | Pending ⚠️  |

## Context

When building with Primer, teams are running into two scenarios:

- It can be difficult to extend or add new functionality to a component
- It can be difficult to build net-new experiences using established patterns (like accessibility primitives)

These challenges lead to custom implementations, forks, or overrides of Primer
components and leads to adoption challenges and ecosystem fragmentation.

## Decision

Primer will provide a spectrum of design system APIs in order to support the different
ways people will like to build on top of, or with, Primer. These include:

- High-level, config-driven components for common patterns and experiences
- Presentational components that are flexible and extensible
- Low-level (base) components and utilities for common patterns, techniques, behaviors,
  etc

### Config components

These components are "all-in-one"; they provide a high level of abstraction that
supports a wide variety of use-cases making it simple to quickly build out
established patterns and experiences. However, they are often inflexible and
difficult to extend.

```tsx
<List
  items={[{label: 'Item one'}, {label: 'Item two'}, {label: 'Item three'}]}
  onSelect={item => {
    /* ... */
  }}
  onFilter={query => {
    /* ... */
  }}
/>
```

### Presentational components

These components provide a lower level of abstraction and are more flexible and extensible, but require more work to build out common patterns and experiences.

```tsx
function Example({items}) {
  const [state, actions] = useList({
    defaultSelected: [],
  })

  return (
    <List>
      <List.Filter
        query={state.query}
        onChange={query => {
          actions.updateQuery(query)
        }}
      />
      {items
        .filter(item => item.label.includes(state.query))
        .map(item => {
          return (
            <List.Item
              key={item.label}
              onClick={() => {
                actions.toggleSelect(item.label)
              }}
            >
              <List.ItemLeadingVisual>
                <Checkbox checked={state.selected.has(item.label)} />
              </List.ItemLeadingVisual>
              <List.ItemLabel>{item.label}</List.ItemLabel>
            </List.Item>
          )
        })}
    </List>
  )
}
```

Presentational components are accompanied by behavior or state hooks for a
component's core functionality. Often times, config components are built by
combining presentational components and the corresponding behavior and state
hooks needed for a feature.

### Base components

Base components are unstyled and may optionally provide behavior. These
components are fundamental primitives that are used to build components, such as
accessibility primitives.

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

Other examples include:

- Combobox (filtering, selection)
- Listbox (selection)
- Popover
- Tabs
- Treeview

### Utilities

## Explorations

- ActionList
- Dialog
- NavList
- UnderlineNav

## Consequences

## Alternatives

## Questions
