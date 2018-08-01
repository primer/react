import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Heading, theme} from '../../src'

const fontSizes = Object.keys(theme.fontSizes)

const HeadingExample = {
  name: 'Heading',
  element: (
    <div>
      <Heading mb={2}>Default Heading</Heading>
      {fontSizes.map(fontSize => (
        <LiveEditor
          key={fontSize}
          code={`<Heading fontSize={${fontSize}} mb={2}>With fontSize={${fontSize}}</Heading>`}
          scope={{Heading, fontSize}}
        />
      ))}
    </div>
  )
}

export default HeadingExample
