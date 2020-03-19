---
title: SelectMenu
---

The `SelectMenu` components are a suite of 9 components which can be combined together to make several different variations of our GitHub select menu. At it's most basic form, a select menu is comprised of a `SelectMenu` wrapper, which contains a `summary` component of your choice and a `Select.Modal` which contains the select menu content. Use `SelectMenu.List` to wrap items in the select menu, and `SelectMenu.Item` to wrap each item.

Several additional components exist to provide even more functionality: `SelectMenu.Filter`, `SelectMenu.Tabs`, `SelectMenu.TabPanel` `SelectMenu.Footer` and `SelectMenu.Divider`.

## Basic Example
```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal title="Projects">
      <SelectMenu.List>
        <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
        <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
        <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
      </SelectMenu.List>
    </SelectMenu.Modal>
  </SelectMenu>
```

## With a Filter
```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal title="Filter by Project">
      <SelectMenu.Filter placeholder="Filter projects" aria-label="Filter Projects"/>
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

## With Tabs
```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal title="Projects">
      <SelectMenu.Tabs tabs={['Repository', 'Organization']}/>
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

### Compponent Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| selected | boolean | | Used to apply styles to the selected items in the list.

## SelectMenu.Tabs
Use `SelectMenu.Tabs` to wrap the the tab navigation and `SelectMenu.Tab` for each tab in the navigation.

`SelectMenu.TabPanel` should wrap each corresponding panel for each of the tabs. The `tabName` prop for each `SelectMenu.TabPanel` must match the name provided in the `tabs` prop on `SelectMenu.Tabs`.

To set one of the tabs to be open by default, use `initialTab` on the main `SelectMenu` component. Otherwise, the first tab will be shown by default.

If you need access to the open tab state, you can find it in the MenuContext object exported from `SelectMenu`.

### System Props

SelectMenu.Tabs components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| tabs | Array | | Array of tab names. Used to generate individual tabs for each item. Must match the `tabName` prop used on `SelectMenu.TabPanel`.

## SelectMenu.TabPanel
Wraps the content for each tab. Make sure to use the `tabName` prop to identify each tab panel with the correct tab in the tab navigation.

### System Props
SelectMenu.TabPanel components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| tabName | String | | Used to identify the corresponding tab. Must match the string used in the `tabs` array in the `SelectMenu.Tabs` component.

## SelectMenu.Filter
Use a `SelectMenu.Filter` to add a filter UI to your select menu. This component manages the input value and exposes it via the `SelectMenu.MenuContext` context, but users are expected to implement their own filtering. This gives users more flexibility over the type of filtering and type of content passed into each select menu item.

### System Props
SelectMenu.Filter components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

### Component Props
SelectMenu.Filter components do not get any additional props besides system props.

## SelectMenu.Divider
Use a `SelectMenu.Divider` to add information between items in a `SelectMenu.List`.

```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal title="Projects">
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
    <SelectMenu.Modal title="Projects">
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