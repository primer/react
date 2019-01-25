
# Dropdown

The Dropdown component is a lightweight context menu for housing navigation and actions.

Dropdown.Button is used to trigger opening and closing the dropdown.

Dropdown.Menu wraps your menu content. Be sure to pass a `direction` prop to this component to position the menu in relation to the Dropdown.Button.

## Default example
```.jsx
<Dropdown scheme="primary" minWidth="5em">
  <Dropdown.Button>Hi</Dropdown.Button>
  <Dropdown.Menu direction='sw'>
    <Dropdown.Item>Item 1</Dropdown.Item>
    <Dropdown.Item>Item 2</Dropdown.Item>
    <Dropdown.Item>Item 3</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

## System props

Dropdown wrapper components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

Dropdown.Menu, Dropdown.Button, and Dropdown.Item do not get any system props.

## Component props


#### Dropdown.Menu
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| direction | String | 'sw' | Sets the direction of the dropdown menu. |

#### Dropdown.Item
No additional props.

#### Dropdown.Button
No additional props.

#### Dropdown
No additional props.


export const meta = {displayName: 'Dropdown'}
