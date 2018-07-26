import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Heading} from '../../src'

const HeadingExample = {
  name: 'Heading',
  element: (
    <div>
      <Heading mb={2}>Default Heading</Heading>
      {[0, 1, 2, 3, 4, 5, /* 6, 7, */ '00-light', '0-light', '1-light', '2-light', '3-light'].map(fontSize => (
        <LiveEditor
          key={fontSize}
          code={`<Heading fontSize={"${fontSize}"} mb={2}>With fontSize={"${fontSize}"}</Heading>`}
          scope={{Heading, fontSize}}
        />
      ))}
    </div>
  )
}

export default HeadingExample
