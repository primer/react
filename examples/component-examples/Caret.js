import React from 'react'
import { Block, Caret, Text, Box } from '../../src'

const CaretExample =
  {
    name: 'Caret',
    element: (
      <Block p={4}>
        {Caret.locations.map((loc, i) => (
          <Box p={2} mb={4} position='relative' maxWidth={300} minHeight={96} shadow key={i}>
            <Text fontSize={1} mono>location='{loc}'</Text>
            <Caret location={loc} />
          </Box>
        ))}
      </Block>
    )
  }

export default CaretExample
