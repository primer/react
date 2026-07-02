# Modular Design System

📆 Date: 2026-05-17

## Status

| Stage          | State       |
| -------------- | ----------- |
| Status         | Proposed ⚠️ |
| Implementation | Pending ⚠️  |

## Context

There is a proposal for enabling better pattern creation via modular building
blocks in: https://github.com/github/core-ux/issues/2238. In this proposal, it
details several layers that Primer could be structured into:

- Layer 3: Ready-made, props-based components that are ready to use
- Layer 2: Parts, presentiontational-style components that one combines with hooks to
  create components
- Layer 1: Foundations, unstyled primitives to allow for full markup and style
  control
- Layer 0: Hooks, state management, and other logic that can be used to build components

We took this proposal into a Modular design System Workshop:
https://github.com/github/primer/discussions/6703. In this workshop, we
identified several scenarios where teams run into challenges when building with
Primer:

- It can be difficult to extend or add new functionality to a component
- It can be difficult to customize the appearance, content, or semantics of a
  component
- It can be difficult to build new experiences using established patterns (like accessibility primitives)

These challenges lead to custom implementations, forks, or overrides of Primer
components that reuslt in adoption challenges and ecosystem fragmentation.

As a result, we applied the layer model to several situations in a
[FigJam](https://www.figma.com/board/mgApQG7vL3imdUIhgyhG2n/Modular-DS-Workshop?node-id=84-152&t=dBKm8jx1UsKRXyzu-1). From this work, we pulled out insights about this model that we want to adopt in Primer today.

## Decision

From the Modular Design System workshop, we identified several key areas that we
want to focus on in order to improve Primer:

- Embrace layer 2 from the layer model, offering parts for our components that
  can be combined with hooks for improved flexibility
- Provide low-level components and hooks to make it easier to build
  quality, accessible experiences
- Create a model for upstreaming work where people have already built on top of Primer

To do this, we will:

- Identify and deliver components that can be broken down into parts, which can be used to create more
  flexible and extensible components
- Identify and deliver low-level components, hooks, and utilities that can be used to quickly build out accessible experiences
- Embrace the spectrum of abstraction model, authoring presentational components
  that combine with hooks to provide flexible patterns and opinionated defaults.

### Embracing the spectrum of abstraction model

We will author components with a spectrum of abstraction in mind, specifically
beginning with presentational components that can combine with hooks to provide
opinionated, config-driven components.

This model allows us to offer opinionated defaults that work for common
scenarios while still allowing teams to extend and customize components as needed.

Default to building presentational components, then add behavior through hooks.
As opinions or defaults are established, create config-driven components that
combine presentational components and hooks to offer a higher level of
abstraction for common use-cases.

#### Config components

These components are "all-in-one"; they provide a high level of abstraction that
support common use-cases making it simple to quickly build out established
patterns and experiences. However, they are often inflexible and difficult to
extend.

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

- High-level abstraction: consumers describe intent through props/data rather than composing markup directly.
- Opinionated defaults: Primer owns the default structure, behavior, accessibility, styling, and interaction patterns.
- Fast path for common use cases: optimized for teams that want to implement an established pattern quickly and correctly.
- Props-driven customization: extension happens through supported props, slots/render props, or configuration—not arbitrary internal composition.
- Limited flexibility by design: they should not try to support every variation; unusual needs may require dropping down to presentational parts.
- Stable product pattern: best suited for patterns Primer understands well and expects many teams to reuse.
- Integrated behavior: state management, keyboard behavior, selection, filtering, validation, etc. are usually bundled in.
- Clear escape boundary: when consumers need to change structure, semantics, or behavior beyond the config API, they should move to presentational components.

#### Presentational components

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
component's core functionality. Oftentimes, config components are built by
combining presentational components with the corresponding behavior and state
hooks needed for a feature.

These components are defined by:

- Mid-level abstraction: consumers compose Primer-provided parts directly while Primer still owns styling and semantics for each part.
- Structure-first API: consumers control layout, ordering, conditional rendering, and content by assembling parts.
- Behavior via hooks: state and interactions are usually provided separately through hooks, letting teams choose how much behavior to adopt.
- Flexible composition: supports variants that config components cannot reasonably expose through props.
- Primer-owned building blocks: parts still encode design-system quality—styling, accessibility expectations, data attributes, and component contracts.
- Best for emerging patterns: useful when a pattern is known, but the right high-level API has not stabilized yet.
- Foundation for config components: config components should often be implemented by composing presentational parts plus behavior hooks.
- More consumer responsibility: consumers gain flexibility but must wire state, events, filtering, selection, and edge cases themselves

#### Base components

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

#### Utilities

There are core utilities, hooks, functions, etc that are commonly used when
building out components or React applications. We provide hooks for established
patterns so that teams can build on solid foundations when authoring new
experiences. These can include hooks such as `useMergedRefs`,
`useOnEscapePress`, `useTimeout` and more.

These utilities may extend beyond hooks, such as `@primer/behaviors` or custom
elements, where appropriate.

## Consequences

This approach is a consolidation of our existing approach to building
components. It highlights changes that need to happen in existing components,
namely SelectPanel and Dialog, that would require changes in order for them to
accomodate the spectrum of abstraction model.

This decision also impacts future component development as components must start
with this in mind. One critical part to this is that authoring components as
parts makes migration over time more difficult. For example, consider an
existing Card component implementation:

```tsx
<Card>
  <Card.Title>Title</Card.Title>
  <Card.Body>Body</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

Over time, there may be a request to add support for a `Card.Action`. This may
require us to add a `Card.Header` part to the Card component.

```tsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Action>Edit</Card.Action>
  </Card.Header>
  <Card.Body>Body</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

As a result, we would need to manage how we support this kind of breaking
change. We could coordinate migrating existing implementations to
the new structure as a part of the change. We could also consider supporting
both structures which would increase the surface area of the component.

## Alternatives

The main alternatives to this approach would be:

- Do nothing, continue our current approach which is causing the challenges
  mentioned at the beginning of the ADR
- Fully adopt the layer model as proposed

Most likely we'll never find a model that will exactly work across components.
As a result, we should develop techniques and learn how to apply them as the
design system grows.

## Questions
