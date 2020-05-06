---
title: FilteredSearch
---

The FilteredSearch component helps style a Dropdown and a TextInput side-by-side.

**Note:** You *must* use a `TextInput` and `Dropdown` (or native `<details>` and `<summary>`) in order for this component to work properly.
## Default example

```jsx live
<FilteredSearch>
  <Dropdown>
    <Dropdown.Button>Filter</Dropdown.Button>
    <Dropdown.Menu direction="sw">
      <Dropdown.Item>Item 1</Dropdown.Item>
      <Dropdown.Item>Item 2</Dropdown.Item>
      <Dropdown.Item>Item 3</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
  <TextInput icon={Search} />
</FilteredSearch>
```

## System props

FilteredSearch gets `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

#### FilteredSearch.Children

FilteredSearch is expected to contain a [`Dropdown`](/Dropdown) followed by a [`TextInput`](/TextInput).
