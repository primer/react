import React from 'react'
import {PropsForm, LiveEditor} from '@compositor/kit'
import {Caret, CaretBox, theme} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const example =
`<CaretBox my={4} p={2} minHeight={100} borderColor="purple">
  CaretBox
</CaretBox>`

const CaretBoxExample = {
  name: 'CaretBox',
  element: (
    <div>
      <ExampleHeading mt={2}>CaretBox</ExampleHeading>
      <LiveEditor code={example} scope={{CaretBox}}/>
    </div>
  )
}

export default CaretBoxExample
