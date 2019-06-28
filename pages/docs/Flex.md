# Flex

Flex is a component that will allow you to use flexbox properties.

*Previously, `Flex.Item` was used for flex item specific properties - we've added all properties to the `Flex` component, but are keeping Flex.Item around for backwards compatibility.*

## Default example

```.jsx
<BorderBox width={300} height={300} borderRadius={0}>
  <Flex flexWrap="nowrap">
    <Box p={3} bg="blue.5">
      Item 1
    </Box>
    <Box p={3} bg="green.5">
      Item 2
    </Box>
    <Box p={3} bg="yellow.5">
      Item 3
    </Box>
  </Flex>
</BorderBox>
```

## System props

Flex components get `FLEX`, `COMMON`, and `LAYOUT` system props.


Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

`Flex` does not get any additional props other than the system props mentioned above.

export const meta = {displayName: 'Flex'}
