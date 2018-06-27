import React from 'react'
import { FlexContainer, FlexItem, Block, Box, Text } from  '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const FlexExample = {
  name: 'Flex',
  element: (
    <Block width={300}>
      <ExampleHeading>FlexContainer direction: row</ExampleHeading>
      <FlexContainer direction="row">
        <FlexItem>
          <Box width={100}>
            <Text>Item 1</Text>
          </Box>
        </FlexItem>
        <FlexItem>
          <Box width={100}>
            <Text>Item 2</Text>
          </Box>
        </FlexItem>
        <FlexItem>
          <Box width={100}>
            <Text>Item 3</Text>
          </Box>
        </FlexItem>
      </FlexContainer>
      <ExampleHeading>FlexContainer direction: column</ExampleHeading>
      <FlexContainer direction="column">
        <FlexItem>
          <Box width={100}>
            <Text>Item 1</Text>
          </Box>
        </FlexItem>
        <FlexItem>
          <Box width={100}>
            <Text>Item 2</Text>
          </Box>
        </FlexItem>
        <FlexItem>
          <Box width={100}>
            <Text>Item 3</Text>
          </Box>
        </FlexItem>
      </FlexContainer>
    </Block>
  )
}

export default FlexExample
