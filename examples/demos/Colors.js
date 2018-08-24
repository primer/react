import React from 'react'
import {Box, FlexContainer, theme} from '../../src'
import {Swatch} from '../doc-components'

const ColorsExample = {
  name: 'Colors',
  element: (
    <Box>
      <Box mb={4}>
        {['gray', 'blue', 'green', 'purple', 'yellow', 'orange'].map(hue => (
          <FlexContainer key={hue}>
            {theme.colors[hue].map((color, j) => (
              <Swatch name={hue} index={j} key={color} color={color} />
            ))}
          </FlexContainer>
        ))}
      </Box>
      <FlexContainer>
        <Box bg="blue.5" p={4} m={1} />
        <Box bg="green.5" p={4} m={1} />
        <Box bg="purple.5" p={4} m={1} />
        <Box bg="yellow.5" p={4} m={1} />
        <Box bg="red.5" p={4} m={1} />
        <Box bg="white" p={4} m={1} border={1} />
        <Box bg="gray.5" p={4} m={1} />
        <Box bg="gray.0" p={4} m={1} />
        <Box bg="blue.0" p={4} m={1} />
        <Box bg="purple.0" p={4} m={1} />
        <Box bg="red.0" p={4} m={1} />
      </FlexContainer>
    </Box>
  )
}

export default ColorsExample
