import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Caret, Text, Box, Block} from '../../src'

const example = loc =>
  `<Box p={2} mb={4} position="relative" maxWidth={300} minHeight={96} shadow="small" key="${loc}">
  <Text fontSize={1} mono>
    location='${loc}'
  </Text>
  <Caret location="${loc}" />
</Box>`

const CaretExample = {
  name: 'Caret',
  element: (
    <Block mt={4}>
      {Caret.locations.map(loc => <LiveEditor key={loc} code={example(loc)} scope={{Text, Caret, Box, loc}} />)}
    </Block>
  )
}

export default CaretExample
