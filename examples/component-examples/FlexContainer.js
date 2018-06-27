import React from 'react'
import { FlexContainer, Box, Text } from  '../../src'

const FlexContainerExample = {
  name: 'FlexContainer',
  element: (
    <FlexContainer breakpoint="sm" direction="row" alignItems="baseline">
      <Box>
        <Text>Hi</Text>
      </Box>
      <Box>
        <Text>Hi</Text>
      </Box>
      <Box>
        <Text>Hi</Text>
      </Box>
      <Box>
        <Text>Hi</Text>
      </Box>
      <Box>
        <Text>Hi</Text>
      </Box>
    </FlexContainer>
  )
}

export default FlexContainerExample
