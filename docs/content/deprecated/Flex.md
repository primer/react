---
title: Flex
status: Deprecated
---

The `Flex` component behaves the same as the `Box` component except that it has `display: flex` set by default.

## Deprecation

Use [Box](/Box) instead.

**Before**

```jsx
<Flex flexWrap="nowrap">
  <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
    Item 1
  </Box>
</Flex>
```

**After**

```jsx
<Box display="flex" flexWrap="nowrap">
  <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
    Item 1
  </Box>
</Box>
```

## Default example

```jsx live
<Box borderWidth="1px" borderStyle="solid" borderColor="border.default" width={300} height={300} borderRadius={0}>
  <Flex flexWrap="nowrap">
    <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
      Item 1
    </Box>
    <Box p={3} color="fg.onEmphasis" bg="attention.emphasis">
      Item 2
    </Box>
    <Box p={3} color="fg.onEmphasis" bg="danger.emphasis">
      Item 3
    </Box>
  </Flex>
</Box>
```

## System props

Flex components get `FLEX`, `COMMON`, and `LAYOUT` system props.

Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

`Flex` does not get any additional props other than the system props mentioned above.
