---
title: Box
---

The Box component serves as a wrapper component for most layout related needs. Use Box to set values such as `display`, `width`, `height`, and more. See the LAYOUT section of our [System Props](/system-props) documentation for the full list of available props. In practice, this component is used frequently as a wrapper around other components to achieve Box Model related styling.

## Examples

### Default

```jsx live
<Box color="text.secondary" bg="bg.tertiary" p={3}>
  Hello
</Box>
```

### Border on all sides

```jsx live
<Box borderColor="border.primary" borderWidth={1} borderStyle="solid" p={3}>
  Hello
</Box>
```

### Border on one side

```jsx live
<Box borderColor="border.primary" borderBottomWidth={1} borderBottomStyle="solid" pb={3}>
  Hello
</Box>
```

### Flexbox

Use `Box` to create [flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox) layouts.

```jsx live
<Box display="flex">
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    1
  </Box>
  <Box flexGrow={1} p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    2
  </Box>
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    3
  </Box>
</Box>
```

### Grid

Use `Box` to create [grid](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids) layouts.

```jsx live
<Box display="grid" gridTemplateColumns="1fr 1fr" gridGap={3}>
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    1
  </Box>
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    2
  </Box>
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    3
  </Box>
</Box>
```

## System props

Box components may receive system props of any category. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop | Type                |                                 Default                                  | Description |
| :--- | :------------------ | :----------------------------------------------------------------------: | :---------- |
| `as` |                     | [`"div"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) |             |
| `sx` | `SystemStyleObject` |                                    —                                     |             |
`Box` also accepts all [styled system props].
