---
title: Details
---

The Details component is an HTML `<details>` element without native browser styling that optionally uses the [render props pattern](https://reactjs.org/docs/render-props.html) to pass its state to child components.

You are responsible for rendering your own `<summary>`. To style your summary element like a [Button](./Button), you can use the `as` prop:

```jsx
<Button as="summary">Summary text</Button>
```

## With static children
```jsx live
<Details>
  <Button as="summary">Click me</Button>
  <p>This should show and hide</p>
</Details>

```

## With children as a function
The render function gets an object with the `open` render prop to allow you to conditionally update UI based on the open state of the dropdown:

```jsx live
<Details>
  {({open}) => (
    <>
      <Button as="summary">
        {open ? 'Hide' : 'Show'}
      </Button>
      <p>This should show and hide</p>
    </>
  )}
</Details>
```

## Manage the open state manually
The `Details` element is built to also let you manage the open state and toggle functionality if necessary. Just provide values to the `open` and `onToggle` props.

**Note:** The `overlay` prop will not function automatically if you chose to provide your own `open` state. You'll need to implement this yourself.

```jsx live
// state component is for demo purposes only.
<State default={false}>
  {([open, setOpen]) => {
    
    const handleToggle = (e) => {
      console.log('toggling')
      setOpen(e.target.open)
    }

    return (
      <Details open={open} onToggle={handleToggle}>
        <Button as="summary">Click me</Button>
        <p>This should show and hide</p>
      </Details>
    )
  }}
</State>
```

## System props

Details components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| defaultOpen | Boolean | | Sets the initial open/closed state |
| overlay | Boolean | false | Sets whether or not element will close when user clicks outside of it |
| open | Boolean | | Use the open prop if you'd like to manage the open state |
| onToggle | Function | | Called whenever user clicks on `summary` element. If you are controlling your own `open` state this will be the only function called on click, otherwise it's called before the internal `handleToggle` function.|
