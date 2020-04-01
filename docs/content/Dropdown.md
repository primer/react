---
title: Dropdown
---
The Dropdown component is a lightweight context menu for housing navigation and actions.

Use `Dropdown.Button` as the trigger for the dropdown, or use a custom `summary` element if you would like. **You must use a `summary` tag in order for the dropdown to behave properly!**. You should also add `aria-haspopup="true"` to custom dropdown triggers for accessibility purposes. You can use the `Dropdown.Caret` component to add a caret to a custom dropdown trigger.

Dropdown.Menu wraps your menu content. Be sure to pass a `direction` prop to this component to position the menu in relation to the Dropdown.Button.

## Default example
```jsx live
<Dropdown direction='w'>
  <Dropdown.Button>Dropdown</Dropdown.Button>
  <Dropdown.Menu direction='sw'>
    <Dropdown.Item>Item 1</Dropdown.Item>
    <Dropdown.Item>Item 2</Dropdown.Item>
    <Dropdown.Item>Item 3</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

## With custom button
```jsx live
<Dropdown>
  <summary>
    Dropdown
    <Dropdown.Caret/>
  </summary>
  <Dropdown.Menu direction='sw'>
    <Dropdown.Item>Item 1</Dropdown.Item>
    <Dropdown.Item>Item 2</Dropdown.Item>
    <Dropdown.Item>Item 3</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

## Manage the open state manually
The `Dropdown` element is built to also let you manage the open state and toggle functionality if necessary. Just provide values to the `open` and `onToggle` props.

```jsx live
<State default={false}>
  {([open, setOpen]) => {
    
    const handleToggle = (e) => {
      setOpen(e.target.open)
    }

    return (
      <Dropdown open={open} onToggle={handleToggle}>
        <Dropdown.Button>Dropdown</Dropdown.Button>
        <Dropdown.Menu direction='sw'>
          <Dropdown.Item>Item 1</Dropdown.Item>
          <Dropdown.Item>Item 2</Dropdown.Item>
          <Dropdown.Item>Item 3</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }}
</State>
```

## System props

Dropdown, Dropdown.Menu, Dropdown.Button, Dropdown.Caret, and Dropdown.Item all get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

#### Dropdown
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| open | Boolean | | Use the open prop if you'd like to manage the open state |
| onToggle | Function | | Called whenever user clicks on `summary` element. If you are controlling your own `open` state this will be the only function called on click, otherwise it's called before the internal `handleToggle` function.|


#### Dropdown.Menu
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| direction | String | 'sw' | Sets the direction of the dropdown menu. Pick from 'ne', 'e', 'se', 's', 'sw', or 'w' |

#### Dropdown.Button
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| onClick | Function | none | Use the `onClick` handler to add additional functionality when the button is clicked, such as fetching data. |

#### Dropdown.Caret
No additional props.

#### Dropdown.Item
No additional props.
