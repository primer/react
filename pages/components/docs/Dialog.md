# Dialog

A dialog

## Default example

```.jsx
<Dialog title="Title" isOpen onDismiss={() => {}}>
  <Box p={3}>
    <Text fontFamily="sans-serif">Some content</Text>
  </Box>
</Dialog>
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
