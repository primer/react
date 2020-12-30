---
title: Dialog
---
import State from '../components/State'

The dialog component is used for all modals. It renders on top of the rest of the app with an overlay.

**Note:** You'll need to manage the `isOpen` state in a wrapper component of your own and pass in a function to be used to close the Dialog. For documentation purposes only we've created a mock `State` to handle this, but you should handle the state in the component you consume `Dialog` in or in a wrapper component.

```jsx live
<State default={false}>
  {([isOpen, setIsOpen]) => (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} aria-labelledby="header-id">
        <Dialog.Header id="header-id">Title</Dialog.Header>
        <Box p={3}>
          <Text fontFamily="sans-serif">Some content</Text>
        </Box>
      </Dialog>
    </>
  )}
</State>
```


You can also pass any non-text content into the header:

```jsx live
<State default={false}>
  {([isOpen, setIsOpen]) => (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} aria-labelledby="label">
        <Dialog.Header>
          <ZapIcon />
        </Dialog.Header>
        <Box p={3}>
          <Text id="label" fontFamily="sans-serif">Are you sure you'd like to delete this issue?</Text>
          <Flex mt={3} justifyContent="flex-end">
            <Button mr={1}>Cancel</Button>
            <ButtonDanger>Delete</ButtonDanger>
          </Flex>
        </Box>
      </Dialog>
    </>
  )}
</State>
```

## System props

`Dialog` components get the `COMMON` and `LAYOUT` categories of system props. `Dialog.Header` components get `COMMON`, `LAYOUT`, and `FLEX` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| isOpen | Boolean | Set whether or not the dialog is shown |
| onDismiss | Function | A user-provided function that should close the dialog |
| aria-labelledby | string | Pass an id to use for the aria-label. Use either a `aria-label` or an `aria-labelledby` but not both.  |
| aria-label | string | Pass a label to be used to describe the Dialog. Use either a `aria-label` or an `aria-labelledby` but not both. |

`Dialog.Header` does not take any non-system props.
