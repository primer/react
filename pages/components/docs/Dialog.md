# Dialog

The dialog component is used for all modals. It renders on top of the rest of the app with an overlay.

## Default example

```.jsx
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

## System props

Dialog components get the `COMMON` and `LAYOUT` categories of system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

These props are **all required**.

| Prop name | Type | Description |
| :- | :- | :- |
| title | String | The title shown in the header |
| isOpen | Boolean | Handles opening and closing the dialog |
| onDismiss | Function | Should close the dialog |

export const meta = {
  displayName: 'Dialog'
}
