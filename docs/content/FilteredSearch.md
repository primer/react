---
componentId: filtered_search
title: FilteredSearch
status: Alpha
---

The FilteredSearch component helps style an ActionMenu and a TextInput side-by-side.

**Note:** You _must_ use a `TextInput` and `ActionMenu` (or native `<details>` and `<summary>`) in order for this component to work properly.

## Default example

```jsx live
<FilteredSearch>
  <ActionMenu>
    <ActionMenu.Button as="summary">Filter</ActionMenu.Button>
    <ActionMenu.Overlay>
      <ActionList>
        <ActionList.Item>Item 1</ActionList.Item>
        <ActionList.Item>Item 2</ActionList.Item>
        <ActionList.Item>Item 3</ActionList.Item>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
  <TextInput leadingVisual={SearchIcon} />
</FilteredSearch>
```

## Component props

#### FilteredSearch.Children

| Name     | Type              | Default | Description                                                                                                   |
| :------- | :---------------- | :-----: | :------------------------------------------------------------------------------------------------------------ |
| children |                   |         | FilteredSearch is expected to contain an [`ActionMenu`](/ActionMenu) followed by a [`TextInput`](/TextInput). |
| sx       | SystemStyleObject |   {}    | Style to be applied to the component                                                                          |
