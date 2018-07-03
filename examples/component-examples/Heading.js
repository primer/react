import React from 'react'
import {Heading} from '../../src'

const HeadingExample = {
  name: 'Heading',
  element: (
    <div>
      <Heading mb={2}>Default Heading</Heading>
      {[0, 1, 2, 3, 4, 5, /* 6, 7, */ '00-light', '0-light', '1-light', '2-light', '3-light'].map(fontSize => (
        <Heading key={fontSize} fontSize={fontSize} mb={2}>
          With fontSize={fontSize}
        </Heading>
      ))}
    </div>
  )
}

export default HeadingExample
