
# Dropdown

The Dropdown component is a lightweight context menu for housing navigation and actions.

Dropdown.Menu wraps your menu content. Be sure to pass a `direction` prop to this component to position the menu in relation to the Dropdown.Button.

## Default example
```.jsx
<Dropdown title="Dropdown one">
  <Dropdown.Menu direction='sw'>
    <Dropdown.Item><Item 1</Dropdown.Item>
    <Dropdown.Item>Item 2</Dropdown.Item>
    <Dropdown.Item>Item 3</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

## System props

Dropdown, Dropdown.Menu, and Dropdown.Item all get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

#### Dropdown.Menu
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| direction | String | 'sw' | Sets the direction of the dropdown menu. |
| title | String | | Sets the text inside of the button |

#### Dropdown.Item
No additional props.

#### Dropdown
No additional props.


export const meta = {displayName: 'Dropdown'}
