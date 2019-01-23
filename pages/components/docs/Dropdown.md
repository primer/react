
# Dropdown

The Dropdown component is a lightweight context menu for housing navigation and actions.

Dropdown.Button is used to trigger opening and closing the dropdown.

Dropdown.Menu wraps your menu content. Be sure to pass a `direction` prop to this component to position the menu in relation to the Dropdown.Button.

## Default example
```.jsx
<Dropdown scheme="primary" minWidth="5em">
  <Dropdown.Button>Hi</Dropdown.Button>
  <Dropdown.Menu direction='sw'>
    <Box>Item 1</Box>
    <Box>Item 2</Box>
    <Box>Item 3</Box>
  </Dropdown.Menu>
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
