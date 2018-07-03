import React from 'react'
import ExampleHeading from '../doc-components/ExampleHeading'
import {Block, Box, Text} from '../../src'

const BoxExample =
  {
    name: 'Box',
    element: (
      <Block p={4}>
        <Box my={4}>Box</Box>
        <Box p={2} my={4}>Box with padding</Box>

        <ExampleHeading>shadows</ExampleHeading>
        {['small', 'medium', 'large', 'extra-large'].map(shadow => (
          <Box shadow={shadow} p={2} my={4}>Box with <Text mono>shadow='{shadow}'</Text></Box>
        ))}

        <ExampleHeading>borders</ExampleHeading>
        {['blue', 'red', 'green', 'gray'].map(borderColor => (
          <Box border={[true, borderColor]} p={2} my={4}>Box with <Text mono>borderColor='{borderColor}'</Text></Box>
        ))}

        <ExampleHeading>rounded corners</ExampleHeading>
        {[0, 1, 2, 3].map(borderRadius => (
          <Box border round={borderRadius} p={2} my={4}>Box with <Text mono>border borderRadius={`{${borderRadius}}`}</Text></Box>
        ))}
      </Block>
    )
  }

export default BoxExample
