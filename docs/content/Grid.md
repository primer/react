---
title: Grid
---

Grid is a component that exposes grid system props. See the [CSS Tricks Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) to learn more about Grid Layout.

## Default example

```jsx live
<Grid gridTemplateColumns="repeat(2, auto)" gridGap={3}>
    <Box p={3} bg="blue.2">1</Box>
    <Box p={3} bg="yellow.2">2</Box>
</Grid>
```

## System props

Grid components get `GRID`, `COMMON`, and `LAYOUT` system props.

Read our [System Props](/components/system-props) doc page for a full list of available props.

## Component props

`Grid` does not get any additional props other than the system props mentioned above.
