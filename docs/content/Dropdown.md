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

**Note:** Closing the dropdown on outside clicks will not function automatically if you chose to provide your own `open` state. You'll need to implement this yourself. You can use the `onClickOutside` prop to implement and customize this behavior.

```jsx live
<State default={false}>
  {([open, setOpen]) => {
    
    const handleToggle = (e) => setOpen(e.target.open)
    const handleClickOutside = () => setOpen(false)

    return (
      <Dropdown open={open} onToggle={handleToggle} onClickOutside={handleClickOutside}>
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

The Dropdown component is extended from the [`Details`](/Details) component and gets all props that the [`Details`](/Details) component gets. They are listed below, but you may reference the [`Details`](/Details) docs for more details on how to manage your own `open` state.

#### Dropdown
| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| defaultOpen | Boolean | | Sets the initial open/closed state |
| overlay | Boolean | false | Sets whether or not element will close when user clicks outside of it |
| open | Boolean | | Use the open prop if you'd like to manage the open state |
| onToggle | Function | | Called whenever user clicks on `summary` element. If you are controlling your own `open` state this will be the only function called on click, otherwise it's called before the internal `handleToggle` function.|
| onClickOutside | Function | | Function to call whenever user clicks outside of the Details component. This is optional and only necessary if you are controlling your own `open` state. |



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
