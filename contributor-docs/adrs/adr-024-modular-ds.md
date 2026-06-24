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
identified several scenarios that team run into challenges when building with
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

### Breaking components down into parts

We will break down the following components into parts plus appropriate
behavioral hooks. These changes will make it easier for teams to layer behavior
on top of these components.

- SelectPanel
- Dialog (and ConfirmationDialog)
- DataTable (write documentation for `useTable` and `Table.*` components)

### Delivering low-level components, hooks, and utilities

We will immediately deliver high-priority components that will assist in building accessible experiences, including:

- **Dialog** for modal and nonmodal experiences with built-in parts for
- **ScrollableRegion** for scrollable containers with built-in accessibility and behaviors
- **Popover** for positioned, transient experiences
- **Tabs** for building tabs-based experiences
- **ToggleButton**, **ToggleSwitch** for building toggle-based experiences
- **Disclosure** for showing/hiding content
- **Accordion** for showing/hiding content

We will also deliver documentation for all existing low-level components,
hooks, and utilities.

In the future, we are investigating the following opportunities for offering
additional low-level components, hooks, and utilities:

- **Listbox** for selection-based experiences
- **Combobox** for filtering and selection-based experiences
  wiring up accessibility, behaviors, and semantics
- **Menu** for action-based experiences
- **Tree** for tree-based experiences
- useFilter
- useSelection

#### Audit

| Entrypoint     | Type      | Name                         |
| :------------- | :-------- | :--------------------------- |
| .              | component | VisuallyHidden               |
|                |           | Announce                     |
|                |           | AriaStatus                   |
|                |           | AriaAlert                    |
|                | hook      | useAnchoredPosition          |
|                |           | useColorSchemeVar            |
|                |           | useConfirm                   |
|                |           | useDetails                   |
|                |           | useFocusTrap                 |
|                |           | useFocusZone                 |
|                |           | useFormControlForwardedProps |
|                |           | useId                        |
|                |           | useIsomorphicLayoutEffect    |
|                |           | useMergedRefs                |
|                |           | useOnEscapePress             |
|                |           | useOnOutsideClick            |
|                |           | useOpenAndCloseFocus         |
|                |           | useOverlay                   |
|                |           | useProvidedRefOrCreate       |
|                |           | useRefObjectAsForwardedRef   |
|                |           | useResizeObserver            |
|                |           | useResponsiveValue           |
|                |           | useRovingTabIndex            |
|                |           | useSafeTimeout               |
|                |           | useSlots                     |
|                |           | useSyncedState               |
|                |           | useTheme                     |
| ./experimental | component | Hidden                       |
|                |           | Tabs                         |
|                | hook      | useSlots                     |
|                |           | useOverflow                  |
|                |           | useTab                       |
|                |           | useTabList                   |
|                |           | useTabPanel                  |

### Embracing the spectrum of abstraction model

We will author components with a spectrum of abstraction in mind, specifically
beginning with presentational components that can combine with hooks to provide
opionated, config-driven components.

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

## Alternatives

## Questions

## Audit

| Entrypoint     | Type     | Name               | Parts | Hooks | Config | Notes |
| :------------- | :------- | :----------------- | :---- | :---- | :----- | :---- |
| .              | Compound | ActionBar          | ✅    |       |        |       |
|                |          | ActionList         | ✅    |       |        |       |
|                |          | ActionMenu         | ✅    |       |        |       |
|                |          | Banner             | ✅    |       |        |       |
|                |          | Breadcrumbs        | ✅    |       |        |       |
|                |          | ConfirmationDialog |       |       | ✅     |       |
|                |          | Details            | ✅    |       |        |       |
|                |          | Dialog             |       |       | ✅     |       |
|                |          | FormControl        | ✅    |       |        |       |
|                |          | Header             | ✅    |       |        |       |
|                |          | NavList            | ✅    |       |        |       |
|                |          | PageHeader         | ✅    |       |        |       |
|                |          | PageLayout         | ✅    |       |        |       |
|                |          | Pagination         |       |       | ✅     |       |
|                |          | Popover            | ✅    |       |        |       |
|                |          | ProgressBar        | ✅    |       |        |       |
|                |          | SegmentedControl   | ✅    |       |        |       |
|                |          | Select             | ✅    |       |        |       |
|                |          | SelectPanel        |       |       | ✅     |       |
|                |          | SplitPageLayout    | ✅    |       |        |       |
|                |          | Stack              | ✅    |       |        |       |
|                |          | SubNav             | ✅    |       |        |       |
|                |          | Timeline           | ✅    |       |        |       |
|                |          | TreeView           | ✅    |       |        |       |
|                |          | UnderlineNav       | ✅    |       |        |       |
| .              | Leaf     | Autocomplete       |       |       |        |       |
|                |          | Avatar             |       |       |        |       |
|                |          | AvatarStack        |       |       |        |       |
|                |          | BranchName         |       |       |        |       |
|                |          | Button             |       |       |        |       |
|                |          | ButtonGroup        |       |       |        |       |
|                |          | Checkbox           |       |       |        |       |
|                |          | CheckboxGroup      |       |       |        |       |
|                |          | CircleBadge        |       |       |        |       |
|                |          | CounterLabel       |       |       |        |       |
|                |          | Heading            |       |       |        |       |
|                |          | IconButton         |       |       |        |       |
|                |          | IssueLabelToken    |       |       |        |       |
|                |          | Label              |       |       |        |       |
|                |          | LabelGroup         |       |       |        |       |
|                |          | Link               |       |       |        |       |
|                |          | LinkButton         |       |       |        |       |
|                |          | Overlay            |       |       |        |       |
|                |          | Radio              |       |       |        |       |
|                |          | RadioGroup         |       |       |        |       |
|                |          | RelativeTime       |       |       |        |       |
|                |          | SkeletonBox        |       |       |        |       |
|                |          | Spinner            |       |       |        |       |
|                |          | StateLabel         |       |       |        |       |
|                |          | Text               |       |       |        |       |
|                |          | TextInput          |       |       |        |       |
|                |          | Textarea           |       |       |        |       |
|                |          | ToggleSwitch       |       |       |        |       |
|                |          | Token              |       |       |        |       |
|                |          | Tooltip            |       |       |        |       |
|                |          | Truncate           |       |       |        |       |
|                | Utility  | AnchoredOverlay    |       |       |        |       |
|                |          | VisuallyHidden     |       |       |        |       |
| ./experimental | Compound | Blankslate         | ✅    |       |        |       |
|                |          | Card               | ✅    |       |        |       |
|                |          | DataTable          |       |       | ✅     |       |
|                |          | FilteredActionList |       |       | ✅     |       |
|                |          | KeybindingHint     |       |       | ✅     |       |
|                |          | SelectPanel        | ✅    |       |        |       |
|                |          | Stack              | ✅    |       |        |       |
|                |          | Table              | ✅    |       |        |       |
|                |          | Tabs               | ✅    | ✅    |        |       |
|                |          | UnderlinePanels    | ✅    |       |        |       |
|                | Leaf     | InlineMessage      |       |       |        |       |
|                |          | IssueLabel         |       |       |        |       |
|                |          | SkeletonAvatar     |       |       |        |       |
|                |          | SkeletonText       |       |       |        |       |
|                |          | Tooltip            |       |       |        |       |
|                |          | TopicTag           |       |       |        |       |
|                | Utility  | Hidden             |       |       |        |       |
