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
The render function gets an object with the `open` prop to allow you to conditionally update UI based on the open state of the dropdown:

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

## System props

Details components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| open | Boolean | | Sets the open/closed state of the Details component |
| overlay | Boolean | false | Sets whether or not element will close when user clicks outside of it
