---
title: Dialog
---
import State from '../components/State'

The dialog component is used for all modals. It renders on top of the rest of the app with an overlay.

You'll need to manage the `isOpen` state in a wrapper component of your own and pass in a function to be used to close the Dialog. For documentation purposes only we've created a mock `State` to handle this, but you should handle the state in the component you consume `Dialog` in or in a wrapper component.

If you're running into z-index issues or are rendering the component inside of an absolutely positioned element, you can wrap your `Dialog` in a React Portal.

### Accessibility

A few considerations must be made to ensure your use of the `Dialog` component is accessible:

- Be sure to pass a ref to return the focus back to once the `Dialog` closes via the `returnFocusRef` prop. In most cases this should be the element that opened the Dialog.

- Always be sure to provide either `aria-labelledby` or `aria-label` to your `Dialog` component. In most cases you should use `aria-labelledby` and pass it the `id` of your `Dialog.Header`. If there is no text in your header, or you chose not to use a header, you can use `aria-label` to describe the purpose of the `Dialog`.

### Examples

```jsx live
<State default={false}>
  {([isOpen, setIsOpen]) => {
    const returnFocusRef = React.useRef(null)
    return (
      <>
        <Button ref={returnFocusRef} onClick={() => setIsOpen(true)}>Open</Button>
        <Dialog returnFocusRef={returnFocusRef} isOpen={isOpen} onDismiss={() => setIsOpen(false)} aria-labelledby="header-id">
          <Dialog.Header id="header-id">Title</Dialog.Header>
          <Box p={3}>
            <Text fontFamily="sans-serif">Some content</Text>
          </Box>
        </Dialog>
      </>
    )
  }}
</State>
```


You can also pass any non-text content into the header:

```jsx live
<State default={false}>
  {([isOpen, setIsOpen]) => {
    const returnFocusRef = React.useRef(null)
    return (
      <>
        <Button ref={returnFocusRef} onClick={() => setIsOpen(true)}>Open</Button>
        <Dialog isOpen={isOpen} returnFocusRef={returnFocusRef} onDismiss={() => setIsOpen(false)} aria-labelledby="label">
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
    )
  }}
</State>
```

## System props

`Dialog` components get the `COMMON` and `LAYOUT` categories of system props. `Dialog.Header` components get `COMMON`, `LAYOUT`, and `FLEX` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| isOpen | Boolean | Set whether or not the dialog is shown |
| onDismiss | Function | A user-provided function that should close the dialog |
| returnFocusRef | React ref | The element to restore focus back to after the `Dialog` is closed |
| initialFocusRef | React ref | Element inside of the `Dialog` you'd like to be focused when the Dialog is opened. If nothing is passed to `intiialFocusRef` the close button is focused. |
| aria-labelledby | string | Pass an id to use for the aria-label. Use either a `aria-label` or an `aria-labelledby` but not both.  |
| aria-label | string | Pass a label to be used to describe the Dialog. Use either a `aria-label` or an `aria-labelledby` but not both. |

`Dialog.Header` does not take any non-system props.
