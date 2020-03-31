---
title: SelectMenu
---

The `SelectMenu` components are a suite of components which can be combined together to make several different variations of our GitHub select menu. At it's most basic form, a select menu is comprised of a `SelectMenu` wrapper, which contains a `summary` component of your choice and a `Select.Modal` which contains the select menu content. Use `SelectMenu.List` to wrap items in the select menu, and `SelectMenu.Item` to wrap each item.

Several additional components exist to provide even more functionality: `SelectMenu.Header`, `SelectMenu.Filter`, `SelectMenu.Tabs`, `SelectMenu.TabPanel` `SelectMenu.Footer` and `SelectMenu.Divider`.

## Basic Example
```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal>
      <SelectMenu.Header>Projects</SelectMenu.Header>
      <SelectMenu.List>
        <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
        <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
        <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
      </SelectMenu.List>
    </SelectMenu.Modal>
  </SelectMenu>
```

## SelectMenu
Main wrapper component for select menu.

### System props

SelectMenu components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| initialTab | String | | If using the `SelectMenu.Tabs` component, you can use this prop to change the tab shown on open. By default, the first tab will be used.


## SelectMenu.Modal
Used to wrap the content in a `SelectMenu`.

### System Props

SelectMenu.Modal components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| title | String | | Sets the text used in the heading inside of the select menu content.


## SelectMenu.List

Used to wrap the select menu list content.  Required.

### System Props

SelectMenu.List components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
SelectMenu.List components do not get any additional props besides system props.


## SelectMenu.Item

Individual items in a select menu.

### System Props

SelectMenu.Item components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| selected | boolean | | Used to apply styles to the selected items in the list. |
| onClick | function | | Function called when item is clicked. By default we also close the menu when items are clicked. If you would like the menu to stay open, pass an `e.preventDefault()` to your onClick handler.  |

## With a Filter

*Note: The filter input value is meant to be controlled/managed by the consuming application.

```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal>
      <SelectMenu.Header>Filter by Project</SelectMenu.Header>
      <SelectMenu.Filter placeholder="Filter projects" value="" aria-label="Filter Projects"/>
      <SelectMenu.List>
        <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
        <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
        <SelectMenu.Divider>More Options</SelectMenu.Divider>
        <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
      </SelectMenu.List>
    </SelectMenu.Modal>
  </SelectMenu>
```

## SelectMenu.Filter
Use a `SelectMenu.Filter` to add a filter UI to your select menu. Users are expected to implement their own filtering and manage the state of the `value` prop on the input. This gives users more flexibility over the type of filtering and type of content passed into each select menu item.

### System Props
SelectMenu.Filter components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| value | String | | Users of this component must provide a value for the filter input that is managed in the consuming application |

## With Tabs
```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal>
      <SelectMenu.Header>Projects</SelectMenu.Header>
      <SelectMenu.Tabs>
        <SelectMenu.Tab index={0} tabName="Repository"/>
        <SelectMenu.Tab index={1} tabName="Organization"/>
      </SelectMenu.Tabs>
      <SelectMenu.TabPanel tabName="Repository">
        <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
        <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
        <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
      </SelectMenu.TabPanel>
      <SelectMenu.TabPanel tabName="Organization">
        <SelectMenu.Item href="#"> Project 2</SelectMenu.Item>
      </SelectMenu.TabPanel>
      <SelectMenu.Footer>Showing 3 of 3</SelectMenu.Footer>
    </SelectMenu.Modal>
  </SelectMenu>
```

## SelectMenu.Tabs
Use `SelectMenu.Tabs` to wrap the the tab navigation and `SelectMenu.Tab` for each tab in the navigation.

`SelectMenu.TabPanel` should wrap each corresponding panel for each of the tabs. The `tabName` prop for each `SelectMenu.TabPanel` must match the name provided in the `tabName` prop on `SelectMenu.Tab`.

To set one of the tabs to be open by default, use `initialTab` on the main `SelectMenu` component. Otherwise, the first tab will be shown by default.

Each `Select.Menu` tab will need to have an `index` prop. The first tab should be at index `0`, the second at index `1` and so forth. The `index` prop is used to show the first tab by default.

If you need access to the selected tab state, you can find it in the MenuContext object exported from `SelectMenu` as `MenuContext.selectedTab`.

### System Props

SelectMenu.Tabs components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| tabs | Array | | Array of tab names. Used to generate individual tabs for each item. Must match the `tabName` prop used on `SelectMenu.TabPanel`.

## SelectMenu.Tab
Used for each individual tab inside of a `SelectMenu.Tabs`. Be sure to set the `index` prop to correspond to the order the tab is in. The `tabName` prop should correspond to the `tabName` set on the `SelectMenu.TabPanel`.

The `onClick` prop is optional and can be used for any events or data fetching you might need to trigger on tab clicks.

### System Props
SelectMenu.Tab components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| tabName | String | | Used to identify the corresponding tab. Must match the string used in the `tabs` array in the `SelectMenu.Tabs` component. |
| index | Number | | The index at which the tab is in the list of tabs |
| onClick | Function | | Function to be called when the tab is clicked. Optional. |

## SelectMenu.TabPanel
Wraps the content for each tab. Make sure to use the `tabName` prop to identify each tab panel with the correct tab in the tab navigation.

**Note**: SelectMenu.TabPanel wraps content in a SelectMenu.List, so adding a SelectMenu.List manually is not necessary.

### System Props
SelectMenu.TabPanel components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| tabName | String | | Used to identify the corresponding tab. Must match the string used in the `tabs` array in the `SelectMenu.Tabs` component.

## SelectMenu.Divider
Use a `SelectMenu.Divider` to add information between items in a `SelectMenu.List`.

```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal>
      <SelectMenu.Header>Projects</SelectMenu.Header>
      <SelectMenu.List>
        <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
        <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
        <SelectMenu.Divider>More Options</SelectMenu.Divider>
        <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
      </SelectMenu.List>
    </SelectMenu.Modal>
  </SelectMenu>
```

### System Props

SelectMenu.Divder components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
SelectMenu.Divider components do not get any additional props besides system props.

## SelectMenu.Footer
Use a `SelectMenu.Footer` to add content to the bottom of the select menu.

```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal>
      <SelectMenu.Header>Projects</SelectMenu.Header>
      <SelectMenu.List>
        <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
        <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
        <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
        <SelectMenu.Footer>Use ⌥ + click/return to exclude labels.</SelectMenu.Footer>
      </SelectMenu.List>
    </SelectMenu.Modal>
  </SelectMenu>
```

### System Props

SelectMenu.Footer components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
SelectMenu.Footer components do not get any additional props besides system props.

## SelectMenu.Header
Use a `SelectMenu.Header` to add a header to the top of the select menu content.

```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal>
      <SelectMenu.Header>Projects</SelectMenu.Header>
      <SelectMenu.List>
        <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
        <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
        <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
        <SelectMenu.Footer>Use ⌥ + click/return to exclude labels.</SelectMenu.Footer>
      </SelectMenu.List>
    </SelectMenu.Modal>
  </SelectMenu>
```

### System Props

SelectMenu.Header components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
SelectMenu.Header components do not get any additional props besides system props.