# FilterList

The FilterList component is a menu with filter options that filter the main content of the page.

## Default example

```.jsx
<FilterList>
  <FilterListItem selected count='32' href='#foo'>First Filter</FilterListItem>
  <FilterListItem count='2' href='#bar'>Second Filter</FilterListItem>
  <FilterListItem href='#baz'>Third Filter</FilterListItem>
</FilterList>
```

## System props

FilterList components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| small | Boolean | false | Used to create a smaller version of the standard FilterList|

export const meta = {displayName: 'FilterList'}
