# ADR 024: Design System API Spectrum

📆 Date: TODO

## Status

| Stage          | State       |
| -------------- | ----------- |
| Status         | Proposed ❓ |
| Implementation | Pending ⚠️  |

## Context

When building with Primer, teams can run into one or more of the following scenarios:

- It can be difficult to extend or add new functionality to a component
- It can be difficult to customize the appearance, content, or semantics of a
  component
- It can be difficult to build new experiences using established patterns (like accessibility primitives)

These challenges lead to custom implementations, forks, or overrides of Primer
components that reuslt in adoption challenges and ecosystem fragmentation.

### Examples

This section contains a variety of examples showing challenges a team may face
when using a component today.

#### ActionList

- ActionList exposes `children` but intrinsically is Parent > Child (problematic
  slot pattern)
- ActionList combines appearance and multiple semantics (list, tree, menu, etc)

#### Dialog

- Examples showing need for customizing appearance

#### SelectPanel

- Examples showing need for behavior changes

## Decision

Primer will provide a spectrum of design system APIs in order to support the different
ways teams want to build with Primer. These include:

- High-level, config-driven components for common patterns and experiences
- Presentational components that are flexible and extensible
- Low-level (base) components and utilities for common patterns, techniques, behaviors,
  etc

Our team will deliver the following low-level components:

- Accordion
- Combobox
- Disclosure
- Dialog
- Listbox
- Menu
- Menubar
- Tree

In order to facilitate development of new feature or functionality using
established patterns. These will be used alongside existing low-level components
and utilities such as:

- Hidden
- ScrollableRegion
- VisuallyHidden
- Truncate
- AriaAlert
- AriaStatus
- Tabs
- useFocusTrap
- useMergedRefs
- useRovingTabIndex

In addition, our team will update our components to better support the
component API spectrum.

| Component           | Config | Presentational | Base | Notes |
| :------------------ | :----- | :------------- | :--- | :---- |
| ActionBar           |        |                |      |       |
| ActionList          |        |                |      |       |
| ActionMenu          |        |                |      |       |
| AnchoredOverlay     |        |                |      |       |
| Autocomplete        |        |                |      |       |
| Avatar              |        |                |      |       |
| AvatarStack         |        |                |      |       |
| Banner              |        |                |      |       |
| Blankslate          |        |                |      |       |
| BranchName          |        |                |      |       |
| Breadcrumbs         |        |                |      |       |
| Button              |        |                |      |       |
| ButtonGroup         |        |                |      |       |
| Card                |        |                |      |       |
| Checkbox            |        |                |      |       |
| CheckboxGroup       |        |                |      |       |
| CircleBadge         |        |                |      |       |
| ConfirmationDialog  |        |                |      |       |
| CounterLabel        |        |                |      |       |
| DataTable           |        |                |      |       |
| Details             |        |                |      |       |
| Dialog              |        |                |      |       |
| FilteredActionList  |        |                |      |       |
| FormControl         |        |                |      |       |
| Header              |        |                |      |       |
| Heading             |        |                |      |       |
| InlineMessage       |        |                |      |       |
| KeybindingHint      |        |                |      |       |
| Label               |        |                |      |       |
| LabelGroup          |        |                |      |       |
| Link                |        |                |      |       |
| NavList             |        |                |      |       |
| Overlay             |        |                |      |       |
| PageHeader          |        |                |      |       |
| PageLayout          |        |                |      |       |
| Pagehead            |        |                |      |       |
| Pagination          |        |                |      |       |
| Placeholder         |        |                |      |       |
| Popover             |        |                |      |       |
| ProgressBar         |        |                |      |       |
| Radio               |        |                |      |       |
| RadioGroup          |        |                |      |       |
| RelativeTime        |        |                |      |       |
| SegmentedControl    |        |                |      |       |
| Select              |        |                |      |       |
| SelectPanel         |        |                |      |       |
| SideNav             |        |                |      |       |
| Skeleton            |        |                |      |       |
| SkeletonAvatar      |        |                |      |       |
| SkeletonText        |        |                |      |       |
| Spinner             |        |                |      |       |
| SplitPageLayout     |        |                |      |       |
| Stack               |        |                |      |       |
| StateLabel          |        |                |      |       |
| SubNav              |        |                |      |       |
| TabNav              |        |                |      |       |
| Text                |        |                |      |       |
| TextInput           |        |                |      |       |
| TextInputWithTokens |        |                |      |       |
| Textarea            |        |                |      |       |
| Timeline            |        |                |      |       |
| ToggleSwitch        |        |                |      |       |
| Token               |        |                |      |       |
| Tooltip             |        |                |      |       |
| TooltipV2           |        |                |      |       |
| TopicTag            |        |                |      |       |
| TreeView            |        |                |      |       |
| UnderlineNav        |        |                |      |       |

### Config components

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

There are core utilities, hooks, functions, etc that are commonly used when
building out components or React applications. We provide hooks for established
patterns so that teams can build on solid foundations when authoring new
experiences. These can include hooks such as `useMergedRefs`,
`useOnEscapePress`, `useTimeout` and more.

These utilities may extend beyond hooks, such as `@primer/behaviors` or custom
elements, where appropriate.

## Explorations

TODO: show this concept applied to the following components

- ActionList
- Dialog
- NavList
- SelectPanel

## Consequences

TODO

## Alternatives

TODO

## Questions

TODO
