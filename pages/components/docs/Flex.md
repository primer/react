# FlexContainer and FlexItem

## Default example

```.jsx
<BorderBox width={300} height={300} borderRadius={0}>
  <FlexContainer flexWrap="nowrap">
    <FlexItem>
      <Box p={3} bg="blue.5">
        Item 1
      </Box>
    </FlexItem>
    <FlexItem>
      <Box p={3} bg="green.5">
        Item 2
      </Box>
    </FlexItem>
    <FlexItem>
      <Box p={3} bg="yellow.5">
        Item 3
      </Box>
    </FlexItem>
  </FlexContainer>
</BorderBox>
```

## System props

FlexContainer components get `FLEX_CONTAINER`, 'COMMON', and 'LAYOUT' system props.

FlexItem components get `FLEX_ITEM`, 'COMMON', and 'LAYOUT' system props.

Read our [System Props](/system-props) doc page for a full list of available props.


export const meta = {displayName: 'Flex'}
