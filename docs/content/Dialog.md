---
title: Dialog
---
import State from '../components/State'
import {Button, Dialog, Box, Text} from '@primer/components'

The dialog component is used for all modals. It renders on top of the rest of the app with an overlay.

**Note:** You'll need to manage the `isOpen` state in a wrapper component of your own. For documentation purposes only we've created a mock `State` to handle this, but you should handle the state in the component you consume `Dialog` in or in a wrapper component.


<State default={false}>
  {([isOpen, setIsOpen]) => (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Dialog title="Title" isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <Box p={3}>
          <Text fontFamily="sans-serif">Some content</Text>
        </Box>
      </Dialog>
    </>
  )}
</State>

```jsx
<State default={false}>
  {([isOpen, setIsOpen]) => (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Dialog title="Title" isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <Box p={3}>
          <Text fontFamily="sans-serif">Some content</Text>
        </Box>
      </Dialog>
    </>
  )}
</State>
```


You can also pass any React node as the title to override the styling:

```jsx
<Dialog title={<Text fontSize={6}>Title</Text>}>
```

## System props

Dialog components get the `COMMON` and `LAYOUT` categories of system props. Read our [System Props](/components/system-props) doc page for a full list of available props.

## Component props

These props are **all required**.

| Prop name | Type | Description |
| :- | :- | :- |
| title | String or Node | The title shown in the header |
| isOpen | Boolean | Handles opening and closing the dialog |
| onDismiss | Function | Should close the dialog |
