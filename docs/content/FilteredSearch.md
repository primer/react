---
title: FilteredSearch
status: Alpha
---

The FilteredSearch component helps style a Dropdown and a TextInput side-by-side.

**Note:** You _must_ use a `TextInput` and `Dropdown` (or native `<details>` and `<summary>`) in order for this component to work properly.

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
  <TextInput icon={SearchIcon} />
</FilteredSearch>
```

## Component props

#### FilteredSearch.Children

| Name     | Type              | Default | Description                                                                                              |
| :------- | :---------------- | :-----: | :------------------------------------------------------------------------------------------------------- |
| children |                   |         | FilteredSearch is expected to contain a [`Dropdown`](/Dropdown) followed by a [`TextInput`](/TextInput). |
| sx       | SystemStyleObject |   {}    | Style to be applied to the component                                                                     |
