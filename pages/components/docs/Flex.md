# Flex and Flex.Item

Flex and Flex.Item are wrapping components that will give the content flexbox properties.

## Default example

```.jsx
<BorderBox width={300} height={300} borderRadius={0}>
  <Flex flexWrap="nowrap">
    <Flex.Item>
      <Box p={3} bg="blue.5">
        Item 1
      </Box>
    </Flex.Item>
    <Flex.Item>
      <Box p={3} bg="green.5">
        Item 2
      </Box>
    </Flex.Item>
    <Flex.Item>
      <Box p={3} bg="yellow.5">
        Item 3
      </Box>
    </Flex.Item>
  </Flex>
</BorderBox>
```

## System props

Flex components get `FLEX_CONTAINER`, `COMMON`, and `LAYOUT` system props.

Flex.Item components get `FLEX_ITEM`, `COMMON`, and `LAYOUT` system props.

Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

Flex and Flex.Item do not get any additional props other than the system props mentioned above.

export const meta = {displayName: 'Flex'}
