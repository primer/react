
# Dropdown

## Default example
```.jsx
<Dropdown scheme="primary" minWidth="5em">
  <Box is="ul" m={0} p={0} className="list-style-none">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </Box>
</Dropdown>
```

## System props

Dropdown components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| scheme | String | Button scheme used to style the component, can be one of `danger`, `outline` or `primary` |
| title | String | Optional prop to set the text in the Dropdown button

export const meta = {displayName: 'Dropdown'}
