---
title: SelectMenu
---
import {SelectMenu} from '@primer/components'

### Default Example
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

### With Tabs

Use `SelectMenu.Tabs` to wrap the the tab navigation and `SelectMenu.Tab` for each tab in the navigation.

`SelectMenu.TabPanel` should wrap each corresponding panel for each of the tabs. The `tabName` prop for each `SelectMenu.TabPanel` must match the name provided in the `tabs` prop on `SelectMenu.Tabs`.

To set one of the tabs to be open by default, use `initialTab` on the main `SelectMenu` component. Otherwise, the first tab will be shown by default.

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

### With `Filter`
Use a `SelectMenu.Filter` to add a filter UI to your select menu. This component manages the input value and exposes it via the `SelectMenu.MenuContext` context, but users are expected to implement their own filtering. This gives users more flexibility over the type of filtering and type of content passed into each select menu item.

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

### With `Divider`
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

### With `Footer`

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

### SelectMenu
Main wrapper component for select menu.

### SelectMenu.Modal
Used to wrap the content in a `SelectMenu`.

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| title | String | | Sets the text used in the heading inside of the select menu content.


### SelectMenu.List

Used to wrap the select menu list content.  Required.

### SelectMenu.Item

Individual items in a select menu.

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| selected | boolean | | Used to apply styles to the selected items in the list.

### SelectMenu.Loading
A default loading state for the SelectMenu contents

### SelectMenu.Footer
A footer for the SelectMenu

### SelectMenu.Tabs
Tab navigation for the SelectMenu.

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| tabs | Array | | Array of tab names. Used to generate individual tabs for each item. Must match the `tabName` prop used on `SelectMenu.TabPanel`.

### SelectMenu.TabPanel
Wraps the content for each tab. Make sure to use the `tabName` prop to identify each tab panel with the correct tab in the tab navigation.

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| tabName | String | | Used to identify the corresponding tab. Must match the string used in the `tabs` array in the `SelectMenu.Tabs` component.

### SelectMenu.Divider
Used to create a divider between list items

