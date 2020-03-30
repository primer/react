---
title: Dialog
---
import State from '../components/State'
import {Button, Dialog, Box, Text} from '@primer/components'

The dialog component is used for all modals. It renders on top of the rest of the app with an overlay.

**Note:** You'll need to manage the `isOpen` state in a wrapper component of your own. For documentation purposes only we've created a mock `State` to handle this, but you should handle the state in the component you consume `Dialog` in or in a wrapper component.

```jsx live
<State default={false}>
  {([isOpen, setIsOpen]) => (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <Dialog.HeaderText>Title</Dialog.HeaderText>
        <Box p={3}>
          <Text fontFamily="sans-serif">Some content</Text>
        </Box>
      </Dialog>
    </>
  )}
</State>
```

To pass non-text content into the header, use `Dialog.Header` instead of `Dialog.HeaderText`:

```jsx live
<State default={false}>
  {([isOpen, setIsOpen]) => (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <Dialog.Header>
          <Octicon icon={Zap} />
        </Dialog.Header>
        <Box p={3}>
          <Text fontFamily="sans-serif">Some content</Text>
        </Box>
      </Dialog>
    </>
  )}
</State>
```

## System props

`Dialog` components get the `COMMON` and `LAYOUT` categories of system props. `Dialog.Header` and `Dialog.HeaderText` components get `COMMON`, `LAYOUT`, and `FLEX` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| isOpen | Boolean | Set whether or not the dialog is shown |
| onDismiss | Function | A user-provided function that should close the dialog |

`Dialog.Header` and `Dialog.HeaderText` do not take any non-system props.
