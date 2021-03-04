---
title: Flex
---

The `Flex` component behaves the same as the `Box` component except that it has `display: flex` set by default.

_Previously, a `Flex.Item` component was used for flex item specific properties; `Box` now contains all those properties and should be used in its place._

## Default example

```jsx live
<BorderBox width={300} height={300} borderRadius={0}>
  <Flex flexWrap="nowrap">
    <Box p={3} bg="bg.info">
      Item 1
    </Box>
    <Box p={3} bg="bg.warning">
      Item 2
    </Box>
    <Box p={3} bg="bg.danger">
      Item 3
    </Box>
  </Flex>
</BorderBox>
```

## System props

Flex components get `FLEX`, `COMMON`, and `LAYOUT` system props.

Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

`Flex` does not get any additional props other than the system props mentioned above.
