import React from 'react'
import { Text } from '../../src'

const TextExample =
  {
    name: 'Text',
    element: (
      <div>
        <Text tag='div'>Text</Text>
        <Text tag='div' fontWeight='bold'>Text bold</Text>
        <Text tag='div' color='green'>Text green</Text>
        <Text tag='div' lineHeight='condensed'>Text lineHeight 'condensed'</Text>
        <Text tag='div' fontSize={4}>Text fontSize 4</Text>
        <Text tag='div' p={4}>Text padding 4</Text>
      </div>
    )
  }

export default TextExample
