---
title: Position Components
---

The Position component is a wrapper component that gives the containing component css positioning abilities.

## Default examples

```jsx live
<Box p={2} mb={200}>
  <Heading mb={2}>Relative + Absolute</Heading>
  <Relative size={128} mx={128} my={6}>
    <Box border={1} borderColor="gray.2" size="100%">
      <Absolute left="100%" top={0} bg="red.1" p={1}>rt</Absolute>
      <Absolute right="100%" top={0} bg="green.1" p={1}>lt</Absolute>
      <Absolute left="100%" bottom={0} bg="blue.1" p={1}>rb</Absolute>
      <Absolute right="100%" bottom={0} bg="purple.1" p={1}>lb</Absolute>
      <Absolute left={0} top="100%" bg="orange.1" p={1}>bl</Absolute>
      <Absolute right={0} top="100%" bg="yellow.3" p={1}>br</Absolute>
      <Absolute left={0} bottom="100%" bg="red.1" p={1}>tl</Absolute>
      <Absolute right={0} bottom="100%" bg="blue.1" p={1}>tr</Absolute>
    </Box>
  </Relative>

  <Heading my={2}>Sticky</Heading>

  <Box border={1} borderColor="green.5" height={1000}>
    <Sticky top={0} bg="green.2" p={6}>
      I'm sticky!
    </Sticky>
  </Box>

  <Heading my={2}>Fixed</Heading>
  <p>(see the bottom right of the screen)</p>

  <Fixed bottom={0} right={0} bg="red.2" p={2}>
    I'm fixed to the bottom right.
  </Fixed>
</Box>
```

## System props

Position components get `POSITION`, `LAYOUT` and `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

Position does not get any additional props other than the system props mentioned above.
