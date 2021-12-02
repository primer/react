---
title: FilterList
status: Alpha
---

The FilterList component is a menu with filter options that filter the main content of the page.

## Default example

```jsx live
<FilterList>
  <FilterList.Item selected count={32} href="#foo">
    First Filter
  </FilterList.Item>
  <FilterList.Item count={2} href="#bar">
    Second Filter
  </FilterList.Item>
  <FilterList.Item href="#baz">Third Filter</FilterList.Item>
</FilterList>
```

## Component props

#### FilterList

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |

#### FilterList.Item

| Name     | Type              | Default | Description                                                      |
| :------- | :---------------- | :-----: | :--------------------------------------------------------------- |
| count    | Number            |         | Number to be displayed in the list item                          |
| as       | String            |   `a`   | sets the HTML tag for the component                              |
| selected | Boolean           |         | Used to set selected style                                       |
| small    | Boolean           |  false  | Used to create a smaller version of the standard FilterList.Item |
| sx       | SystemStyleObject |   {}    | Style to be applied to the component                             |
