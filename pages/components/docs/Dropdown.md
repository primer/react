
# Dropdown

The Dropdown component is a lightweight context menu for housing navigation and actions.

## Default example
```.jsx
<Dropdown scheme="primary" minWidth="5em">
  <Box role="list">
    <Box role="listitem">Item 1</Box>
    <Box role="listitem">Item 2</Box>
    <Box role="listitem">Item 3</Box>
  </Box>
</Dropdown>
```

## System props

Dropdown components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| scheme | String | | Button scheme used to style the component, can be one of `danger`, `outline` or `primary` |
| title | String | | Optional prop to set the text in the Dropdown button

export const meta = {displayName: 'Dropdown'}
