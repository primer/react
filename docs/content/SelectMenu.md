---
title: SelectMenu
---
import {SelectMenu} from '@primer/components'

### Default Example
```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal title="Filter by Project">
      <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
      <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
      <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
      <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
    </SelectMenu.Modal>
  </SelectMenu>
```

### With `Divider`
Use a `SelectMenu.Divider` to add information between items in a `SelectMenu.List`.

```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal title="Filter by Project">
      <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
      <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
      <SelectMenu.Divider>More Options</SelectMenu.Divider>
      <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
      <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
    </SelectMenu.Modal>
  </SelectMenu>
```

### With `Footer`

Use a `SelectMenu.Footer` to add content to the bottom of the select menu.

```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal title="Filter by project">
      <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
      <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
      <SelectMenu.Divider>More Options</SelectMenu.Divider>
      <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
      <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
      <SelectMenu.Footer>Use ⌥ + click/return to exclude labels.</SelectMenu.Footer>
    </SelectMenu.Modal>
  </SelectMenu>
```


### With Tabs

Use `SelectMenu.Tabs` to wrap the the tab navigation and `SelectMenu.Tab` for each tab in the navigation.

`SelectMenu.TabPanel` should wrap each corresponding panel for each of the tabs. The `tabName` prop for each `SelectMenu.TabPanel` must match the `name` prop on the corresponding `SelectMenu.Tab`.

To set one of the tabs to be open by default, use `initialTab` on the main `SelectMenu` component. Otherwise, the first tab will be shown by default.

```jsx live
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal title="Filter by project">
      <SelectMenu.Filter placeholder="Filter projects" aria-label="Filter Projects"/>
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

### SelectMenu
Used as a wrapper component for select menus

### SelectMenu.Modal
Provides styling for the SelectMenu content

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| title | String | | Sets the text used in the heading inside of the select menu content.

### SelectMenu.Item

Items in the SelectMenu.List. Handle setting the `aria-checked` attribute in the consuming application. When `aria-checked` is set to true, selected styles will appear for list items.


### SelectMenu.Loading
A default loading state for the SelectMenu contents

### SelectMenu.Footer
A footer for the SelectMenu

### SelectMenu.Tabs
Tab navigation for the SelectMenu

### SelectMenu.Divider
Used to create a divider between list items

