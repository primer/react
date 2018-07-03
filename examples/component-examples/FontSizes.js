import React from 'react'
import {Text} from '../../src'

const FontSizesExample = {
  name: 'Font sizes',
  element: (
    <div>
      {[/* 7, 6, */ 5, 4, 3, 2, 1, 0].map(fontSize => (
        <Text tag="div" key={fontSize} fontSize={fontSize}>
          fontSize {fontSize}
        </Text>
      ))}
    </div>
  )
}

export default FontSizesExample
