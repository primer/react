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

## System props

Details components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| defaultOpen | Boolean | | Sets the initial open/closed state |
| overlay | Boolean | false | Sets whether or not element will close when user clicks outside of it |
| open | Boolean | | Use the open prop if you'd like to manage the open state |
| onToggle | Function | | Called whenever user clicks on `summary` element. If you are controlling your own `open` state this will be the only function called on click, otherwise it's called before the internal `handleToggle` function.|
| onClickOutside | Function | | Function to call whenever user clicks outside of the Details component. This is optional and only necessary if you are controlling your own `open` state. |
| ref | React ref | | ref to pass down to Details component |


## DetailsContext
DetailsContext is a [context object](https://reactjs.org/docs/context.html#reactcreatecontext) that exposes some helpful state values to be used via [`React.useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) in consuming applications.  DetailsContext can only be used in components that are already wrapped in a `Details` as `Details` contains the [context provider](https://reactjs.org/docs/context.html#contextprovider).

`Details.Context` contains the `open` and `setOpen` values which can be used to conditionally update UI based on the open state of the dropdown or set up useEffects to trigger some actions when the `open` state changes.

### Example Usage
```jsx
import {Details, DetailsContext, Button} from `@primer/components`
import React, {useContext} from 'react'

const MyDetails = () => {
  <Details>
    <MyButton as="summary" />
    content
  </Details>
}

// note that we can only use the context in components that are already wrapped by Details (and thus the Context.Provider)
const MyButton = () => {
  const detailsContext = useContext(DetailsContext);

  return (
    <Button as="summary">{detailsContext.open ? 'Open' : 'Closed'}</Button>
  )
}
```

### Values available on DetailsContext
| Name | Type | Description |
| :- | :- | :- |
| open | string | Whether or not Details is currently open |
| setOpen | function | Used to manually change the open state of the Details component |
