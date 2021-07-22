---
title: FilterList
---

The FilterList component is a menu with filter options that filter the main content of the page.

## Default example

```jsx live
<FilterList>
  <FilterList.Item selected count="32" href="#foo">
    First Filter
  </FilterList.Item>
  <FilterList.Item count="2" href="#bar">
    Second Filter
  </FilterList.Item>
  <FilterList.Item href="#baz">Third Filter</FilterList.Item>
</FilterList>
```

## System props

<Note variant="warning">

System props are deprecated in all components except [Box](/Box). Please use the [`sx` prop](/overriding-styles) instead.

</Note>

FilterList components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

#### FilterList

`FilterList` does not get any additional props other than the system props mentioned above.

#### FilterList.Item

| Name     | Type    | Default | Description                                                      |
| :------- | :------ | :-----: | :--------------------------------------------------------------- |
| count    | Number  |         | Number to be displayed in the list item                          |
| as       | String  |   `a`   | sets the HTML tag for the component                              |
| selected | Boolean |         | Used to set selected style                                       |
| small    | Boolean |  false  | Used to create a smaller version of the standard FilterList.Item |
