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
  quality, accessible experience
- Create a model for upstreaming work where people build on top of Primer

In addition, when authoring components we will offer presentational components
and behavioral hooks that can then be used for higher-level, props-based
components.

### Embracing layer 2

- Parts provide a clear way for teams to layer on functionality that does not
  exist
- It provides a clear path for upstreaming
- The biggest gap is providing behavioral/state hooks for components (if needed)

`N/A` means that layer is not a useful fit for the component's API shape.

| Entrypoint     | Component           | Props | Parts | Hooks | Notes                                                                                                             |
| :------------- | :------------------ | :---- | :---- | :---- | :---------------------------------------------------------------------------------------------------------------- |
| .              | ActionBar           | N/A   | Yes   | No    | Parts include `IconButton`, `Divider`, `Group`, and `Menu`; no public ActionBar behavior hook.                    |
|                | ActionList          | N/A   | Yes   | No    | Compound list API with item, group, divider, visual, description, and action parts.                               |
|                | ActionMenu          | No    | Yes   | No    | Parts include `Button`, `Anchor`, `Overlay`, and `Divider`; menu contents use `ActionList`.                       |
|                | AnchoredOverlay     | Yes   | N/A   | Yes   | Props-driven overlay; behavior can be recreated with `useAnchoredPosition` and `useOverlay`.                      |
|                | Autocomplete        | No    | Yes   | No    | Slot API exposes `Input`, `Menu`, and `Overlay`; no public autocomplete hook.                                     |
|                | Avatar              | Yes   | N/A   | N/A   | Leaf visual component.                                                                                            |
|                | AvatarStack         | Yes   | N/A   | No    | Props-driven wrapper around `Avatar` children; no public stack behavior hook.                                     |
|                | Banner              | Yes   | Yes   | N/A   | Supports title, description, and action props plus matching parts.                                                |
|                | BaseStyles          | Yes   | N/A   | N/A   | Props-driven application wrapper.                                                                                 |
|                | BranchName          | Yes   | N/A   | N/A   | Leaf display component.                                                                                           |
|                | Breadcrumb          | N/A   | Yes   | N/A   | Deprecated alias of `Breadcrumbs` with `Item`.                                                                    |
|                | Breadcrumbs         | N/A   | Yes   | N/A   | Uses `Breadcrumbs.Item`; no props-only item list API.                                                             |
|                | Button              | Yes   | N/A   | N/A   | Leaf action component.                                                                                            |
|                | ButtonGroup         | Yes   | N/A   | N/A   | Props-driven grouping wrapper for button children.                                                                |
|                | Checkbox            | Yes   | N/A   | N/A   | Native input wrapper.                                                                                             |
|                | CheckboxGroup       | N/A   | Yes   | No    | Uses label, caption, and validation parts through the shared choice-group implementation.                         |
|                | ConfirmationDialog  | Yes   | N/A   | Yes   | Props-driven dialog with `useConfirm` behavior hook.                                                              |
|                | CounterLabel        | Yes   | N/A   | N/A   | Leaf count display component.                                                                                     |
|                | Details             | N/A   | Yes   | Yes   | Exposes `Summary` plus `useDetails`.                                                                              |
|                | Dialog              | Yes   | Yes   | No    | Props-driven dialog also exposes parts for custom renderers; `useDialog` is internal.                             |
|                | Flash               | Yes   | N/A   | N/A   | Props-driven message component.                                                                                   |
|                | FocusKeys           | N/A   | N/A   | Yes   | Not a component; exported behavior constant used with `useFocusZone`.                                             |
|                | FormControl         | N/A   | Yes   | Yes   | Parts include `Label`, `Caption`, `LeadingVisual`, and `Validation`; hook forwards form-control props.            |
|                | Header              | N/A   | Yes   | N/A   | Structural API exposes `Item` and `Link`.                                                                         |
|                | Heading             | Yes   | N/A   | N/A   | Leaf typography component.                                                                                        |
|                | IconButton          | Yes   | N/A   | N/A   | Leaf action component.                                                                                            |
|                | IssueLabelToken     | Yes   | N/A   | N/A   | Props-driven token variant.                                                                                       |
|                | Label               | Yes   | N/A   | N/A   | Leaf display component.                                                                                           |
|                | LabelGroup          | Yes   | N/A   | N/A   | Props-driven grouping wrapper for labels.                                                                         |
|                | Link                | Yes   | N/A   | N/A   | Leaf navigation component.                                                                                        |
|                | LinkButton          | Yes   | N/A   | N/A   | Leaf action/navigation component.                                                                                 |
|                | NavList             | N/A   | Yes   | No    | Compound navigation API with item, group, visual, divider, and subnav parts.                                      |
|                | Overlay             | Yes   | N/A   | Yes   | Props-driven floating surface backed by `useOverlay`.                                                             |
|                | PageHeader          | N/A   | Yes   | N/A   | Structural API exposes title, context, action, visual, description, and navigation parts.                         |
|                | PageLayout          | N/A   | Yes   | No    | Layout parts include `Header`, `Content`, `Pane`, `Sidebar`, and `Footer`; no public layout hook.                 |
|                | Pagination          | Yes   | N/A   | No    | Props-driven pagination model; no public pagination hook.                                                         |
|                | Popover             | Yes   | Yes   | N/A   | Props-driven wrapper with `Content` part.                                                                         |
|                | Portal              | Yes   | N/A   | N/A   | Low-level rendering utility.                                                                                      |
|                | PortalContext       | N/A   | N/A   | N/A   | Context export rather than a component API.                                                                       |
|                | ProgressBar         | Yes   | Yes   | N/A   | Props-driven bar with `Item` for segmented progress.                                                              |
|                | Radio               | Yes   | N/A   | N/A   | Native input wrapper.                                                                                             |
|                | RadioGroup          | N/A   | Yes   | No    | Uses label, caption, and validation parts through the shared choice-group implementation.                         |
|                | RelativeTime        | Yes   | N/A   | N/A   | Props-driven time display.                                                                                        |
|                | ResponsiveValue     | N/A   | N/A   | Yes   | Type-level API paired with `useResponsiveValue`.                                                                  |
|                | SegmentedControl    | N/A   | Yes   | No    | Compound control with `Button` and `IconButton` parts; no public segmented-control hook.                          |
|                | Select              | Yes   | Yes   | N/A   | Native select wrapper with `Option` and `OptGroup` parts.                                                         |
|                | SelectPanel         | Yes   | Yes   | No    | Props-driven selection panel; parts cover messages and secondary actions, not the full behavior.                  |
|                | SideNav             | N/A   | Yes   | N/A   | Deprecated structural nav with `Link` part.                                                                       |
|                | SkeletonBox         | Yes   | N/A   | N/A   | Leaf skeleton component.                                                                                          |
|                | Spinner             | Yes   | N/A   | N/A   | Leaf loading component.                                                                                           |
|                | SplitPageLayout     | N/A   | Yes   | No    | Layout parts mirror `PageLayout`; no public layout hook.                                                          |
|                | Stack               | Yes   | Yes   | N/A   | Props-driven layout primitive with optional `Item` part.                                                          |
|                | StateLabel          | Yes   | N/A   | N/A   | Leaf display component.                                                                                           |
|                | SubNav              | N/A   | Yes   | N/A   | Structural nav with `Link` and `Links` parts.                                                                     |
|                | Text                | Yes   | N/A   | N/A   | Leaf typography component.                                                                                        |
|                | Textarea            | Yes   | N/A   | N/A   | Native input wrapper.                                                                                             |
|                | TextInput           | Yes   | Yes   | N/A   | Props-driven input with `Action` as an optional part.                                                             |
|                | TextInputWithTokens | Yes   | N/A   | No    | Props-driven tokenized input; no public token-input behavior hook.                                                |
|                | ThemeProvider       | Yes   | N/A   | Yes   | Provider component plus `useTheme` and `useColorSchemeVar`.                                                       |
|                | Timeline            | N/A   | Yes   | N/A   | Structural timeline with item, avatar, badge, body, break, and action parts.                                      |
|                | ToggleSwitch        | Yes   | N/A   | N/A   | Props-driven switch component.                                                                                    |
|                | Token               | Yes   | N/A   | N/A   | Leaf token component.                                                                                             |
|                | Tooltip             | Yes   | N/A   | No    | Props-driven tooltip; no public tooltip behavior hook.                                                            |
|                | TreeView            | N/A   | Yes   | Yes   | Compound tree API with item/subtree/visual parts and `useRovingTabIndex`.                                         |
|                | Truncate            | Yes   | N/A   | N/A   | Props-driven text utility.                                                                                        |
|                | UnderlineNav        | N/A   | Yes   | N/A   | Structural nav with `Item` part.                                                                                  |
|                | VisuallyHidden      | Yes   | N/A   | N/A   | Leaf accessibility utility.                                                                                       |
| ./experimental | Announce            | Yes   | N/A   | N/A   | Props-driven live-region primitive; no public announcement hook (available through `@primer/live-region-element`  |
|                | AriaAlert           | Yes   | N/A   | N/A   | Props-driven assertive live-region wrapper.                                                                       |
|                | AriaStatus          | Yes   | N/A   | N/A   | Props-driven polite live-region wrapper.                                                                          |
|                | Blankslate          | N/A   | Yes   | N/A   | Parts-first API with visual, heading, description, and action parts.                                              |
|                | Card                | N/A   | Yes   | N/A   | Parts-first card with icon, image, heading, description, action, and metadata parts.                              |
|                | DataTable           | Yes   | Yes   | Yes   | Props-driven data grid; presentational table parts are exposed through `Table`. Hook is `useTable`                |
|                | Dialog              | Yes   | Yes   | No    | Same public API shape as the root export.                                                                         |
|                | FilteredActionList  | Yes   | Yes   | No    | Props-driven filtered list with `Input` and `BodyLoader` parts.                                                   |
|                | Hidden              | N/A   | Yes   | N/A   | Props-driven responsive visibility utility.                                                                       |
|                | InlineMessage       | N/A   | Yes   | N/A   | Leaf message component.                                                                                           |
|                | IssueLabel          | N/A   | Yes   | N/A   | Props-driven issue label component.                                                                               |
|                | KeybindingHint      | Yes   | N/A   | N/A   | Props-driven text utility for keybindings.                                                                        |
|                | NavList             | N/A   | Yes   | No    | Same public API shape as the root export.                                                                         |
|                | PageHeader          | N/A   | Yes   | N/A   | Same public API shape as the root export.                                                                         |
|                | ScrollableRegion    | Yes   | N/A   | N/A   | Props-driven accessibility wrapper.                                                                               |
|                | SelectPanel         | N/A   | Yes   | No    | Experimental parts-first panel with button, header, search, footer, loading, message, and secondary action parts. |
|                | SkeletonAvatar      | Yes   | N/A   | N/A   | Leaf skeleton component.                                                                                          |
|                | SkeletonText        | Yes   | N/A   | N/A   | Leaf skeleton component.                                                                                          |
|                | Stack               | Yes   | Yes   | N/A   | Same public API shape as the root export.                                                                         |
|                | Table               | N/A   | Yes   | N/A   | Presentational table parts for `DataTable`.                                                                       |
|                | Tabs                | N/A   | Yes   | Yes   | Experimental primitive exposes `TabList`, `Tab`, `TabPanel`, and related hooks.                                   |
|                | Tooltip             | Yes   | N/A   | No    | Same public API shape as the root export.                                                                         |
|                | TopicTag            | Yes   | Yes   | N/A   | Props-driven tag with `Group` part.                                                                               |
|                | UnderlinePanels     | N/A   | Yes   | No    | Parts-first tab panel API with `Tab` and `Panel`; no public hook.                                                 |

### Low-level components and hooks

We want to offer more low-level components and hooks, in particular with a focus
on accessibility. Providing these low-level abstractions allows for quickly creating
robust experiences instead of having to re-invent them from scratch.

In particular, we would like to offer the following primitives:

| Type       | Name              | Supported | Description                                | Notes                                                                                               |
| :--------- | :---------------- | :-------- | :----------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| Components | Accordion         | No        | Disclosure group primitive.                | Not exposed today.                                                                                  |
|            | Combobox          | No        | Text input plus listbox popup primitive.   | Autocomplete and SelectPanel cover product use cases, but no generic combobox primitive is exposed. |
|            | Disclosure        | No        | Show/hide primitive.                       | `Details` and `useDetails` exist, but there is no named `Disclosure` primitive.                     |
|            | Dialog            | Yes       | Modal dialog primitive.                    | `Dialog` exposes props and custom-renderer parts.                                                   |
|            | Listbox           | No        | Option list primitive.                     | ActionList and SelectPanel cover product use cases, but no generic listbox primitive is exposed.    |
|            | Menu              | No        | Menu button and popup primitive.           | ActionMenu covers product use cases, but no generic menu primitive is exposed.                      |
|            | Menubar           | No        | Horizontal menu primitive.                 | Not exposed today.                                                                                  |
|            | Popover           | Yes       | Anchored floating content primitive.       | Covered by `Popover`, `Overlay`, and `AnchoredOverlay`.                                             |
|            | Tabs              | Yes       | Tab state and tab/panel primitive.         | Available from `./experimental` with parts and hooks.                                               |
|            | Tree              | Yes       | Tree navigation primitive.                 | Covered by `TreeView`; no separate unstyled `Tree` primitive is exposed.                            |
| Hooks      | useFocusTrap      | Yes       | Trap focus within a container.             | Exported from the root entrypoint.                                                                  |
|            | useMergedRefs     | Yes       | Merge multiple refs into one ref callback. | Exported from the root entrypoint.                                                                  |
|            | useRovingTabIndex | Yes       | Manage roving tab index behavior.          | Exported from the root entrypoint via `TreeView`.                                                   |
|            | useTabs           | Yes       | Manage tab state and ARIA wiring.          | Available from `./experimental` alongside `useTab`, `useTabList`, and `useTabPanel`.                |

### Model for upstreaming work

### Authoring components

#### Config components

These components are "all-in-one"; they provide a high level of abstraction that
support common use-cases making it simple to quickly build out established
patterns and experiences. However, they are often inflexible and difficult to
extend.

````tsx
<List
  items={[{label: 'Item one'}, {label: 'Item two'}, {label: 'Item three'}]}
  onSelect={item => {
    /* ... */
  }}
  onFilter={query => {
    /* ... */
  }}
/>

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
````

Presentational components are accompanied by behavior or state hooks for a
component's core functionality. Often times, config components are built by
combining presentational components and the corresponding behavior and state
hooks needed for a feature.

## Consequences

TODO

## Alternatives

TODO

## Questions

TODO
