---
title: Details
---

import {useContext, useRef} from 'react'
import {useDetails} from '@primer/components'

The Details component is an HTML `<details>` element without native browser styling that as exposes a [context object]((https://reactjs.org/docs/hooks-reference.html#usecontext) to expose the `open` state and `setOpen` function to update that state.

You are responsible for rendering your own `<summary>`. To style your summary element like a [Button](./Button), you can use the `as` prop:

```jsx live
<State>
  {([]) => {
    const ref = React.useRef()
    const {getDetailsProps, setOpen, open} = useDetails({closeOnOutsideClick: true})
    return (
      <Details {...getDetailsProps()}>
        <Button as="summary">{open ? 'open' : 'closed'}</Button>
        Are you sure you want to delete this issue?
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <ButtonDanger onClick={() => setOpen(false)}>Delete</ButtonDanger>
      </Details>
    )
  }}
</State>

```

## With static children

## System props

Details components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| defaultOpen | Boolean | | Sets the initial open/closed state |
| overlay | Boolean | false | Sets whether or not element will close when user clicks outside of it |
| onToggle | Function | | Called whenever user clicks on `summary` element |
| ref | React ref | | ref to pass down to Details component |




### Values available on Details.Context
| Name | Type | Description |
| :- | :- | :- |
| open | string | Whether or not Details is currently open |
| setOpen | function | Used to manually change the open state of the Details component |
