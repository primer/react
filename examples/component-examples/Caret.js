import React from 'react'
import {Caret, Text, Box} from '../../src'

const CaretExample = {
  name: 'Caret',
  element: (
    <div>
      {Caret.locations.map(loc => (
        <Box p={2} mb={4} position="relative" maxWidth={300} minHeight={96} shadow="small" key={loc}>
          <Text fontSize={1} mono>
            location='{loc}'
          </Text>
          <Caret location={loc} />
        </Box>
      ))}
    </div>
  )
}

export default CaretExample
