import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, Box, Caret, Relative, Text} from '../../src'

const example = loc =>
  `
<Box is={Relative} p={2} m={4} mb={3} minHeight={100} maxWidth={300}>
  <Text fontSize={1} fontFamily="mono">
    location="${loc}"
  </Text>
  <Caret location="${loc}" borderColor="gray.2" />
</Box>`.trim()

const scope = {Box, Caret, Relative, Text}

const CaretExample = {
  name: 'Caret',
  element: (
    <Block my={5}>{Caret.locations.map(loc => <LiveEditor key={loc} code={example(loc)} scope={scope} />)}</Block>
  )
}

export default CaretExample
