---
componentId: position
title: Position
status: Deprecated
---

The Position component is a wrapper component that gives the containing component css positioning abilities.

## Deprecation

Use [Box](/Box) instead.

**Before**

```jsx
<>
  <Position position="absolute">...</Position>
  <Absolute>...</Absolute>
  <Relative>...</Relative>
  <Fixed>...</Fixed>
  <Sticky>...</Sticky>
</>
```

**After**

```jsx
<>
  <Box position="absolute">...</Box>
  <Box position="absolute">...</Box>
  <Box position="relative">...</Box>
  <Box position="fixed">...</Box>
  <Box position="sticky">...</Box>
</>
```

## Default examples

```jsx live
<Box p={2} mb={200}>
  <Heading mb={2}>Relative + Absolute</Heading>
  <Relative size={128} mx={128} my={6}>
    <Box borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2} size="100%">
      <Absolute left="100%" top={0} color="fg.onEmphasis" bg="success.emphasis" p={1}>
        rt
      </Absolute>
      <Absolute right="100%" top={0} color="fg.onEmphasis" bg="success.emphasis" p={1}>
        lt
      </Absolute>
      <Absolute left="100%" bottom={0} color="fg.onEmphasis" bg="success.emphasis" p={1}>
        rb
      </Absolute>
      <Absolute right="100%" bottom={0} color="fg.onEmphasis" bg="success.emphasis" p={1}>
        lb
      </Absolute>
      <Absolute left={0} top="100%" color="fg.onEmphasis" bg="success.emphasis" p={1}>
        bl
      </Absolute>
      <Absolute right={0} top="100%" color="fg.onEmphasis" bg="success.emphasis" p={1}>
        br
      </Absolute>
      <Absolute left={0} bottom="100%" color="fg.onEmphasis" bg="success.emphasis" p={1}>
        tl
      </Absolute>
      <Absolute right={0} bottom="100%" color="fg.onEmphasis" bg="success.emphasis" p={1}>
        tr
      </Absolute>
    </Box>
  </Relative>

  <Heading my={2}>Sticky</Heading>

  <Box borderWidth="1px" borderStyle="solid" borderColor="success.emphasis" borderRadius={2} border={1} height={500}>
    <Sticky top={0} bg="success.subtle" p={6}>
      I'm sticky!
    </Sticky>
  </Box>

  <Heading my={2}>Fixed</Heading>
  <p>(see the bottom right of the screen)</p>

  <Fixed bottom={0} right={0} color="fg.onEmphasis" bg="danger.emphasis" p={2}>
    I'm fixed to the bottom right.
  </Fixed>
</Box>
```

## System props

Position components get `POSITION`, `LAYOUT`, `FLEX`, and `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

Position does not get any additional props other than the system props mentioned above.
