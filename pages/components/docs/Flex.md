# FlexContainer and FlexItem
---
```.jsx
<ExampleHeading mt={3}>FlexContainer + FlexItems</ExampleHeading>
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


<ExampleHeading mt={2}>FlexContainer + FlexItems direction set to 'column'</ExampleHeading>
<BorderBox width={400} height={200} borderRadius={0}>
  <FlexContainer flexWrap="nowrap" flexDirection='column'>
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

<ExampleHeading mt={2}>FlexContainer + FlexItems using tag prop set to "p"</ExampleHeading>
<BorderBox width={400} height={200} borderRadius={0}>
  <FlexContainer flexWrap="nowrap">
    <FlexItem is="p">
      <Box p={3} bg="blue.5">
        Item 1
      </Box>
    </FlexItem>
    <FlexItem is="p">
      <Box p={3} bg="green.5">
        Item 2
      </Box>
    </FlexItem>
    <FlexItem is="p">
      <Box p={3} bg="yellow.5">
        Item 3
      </Box>
    </FlexItem>
  </FlexContainer>
</BorderBox>
```

export const meta = {displayName: 'Flex'}
