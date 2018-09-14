# FilterList

## Default example

```.jsx
<FilterList>
  <FilterListItem selected count='32' href='#foo'>First Filter</FilterListItem>
  <FilterListItem count='2' href='#bar'>Second Filter</FilterListItem>
  <FilterListItem href='#baz'>Third Filter</FilterListItem>
</FilterList>
```

## System props

FilterList components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| small | Boolean | Used to create a smaller version of the standard FilterList|

export const meta = {displayName: 'FilterList'}
