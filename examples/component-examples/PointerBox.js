import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {CaretBox} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const example = `<CaretBox m={4} p={2} minHeight={100} bg="green.1" borderColor="green.5">
  CaretBox
</CaretBox>`

const CaretBoxExample = {
  name: 'CaretBox',
  element: (
    <div>
      <ExampleHeading mt={2}>CaretBox</ExampleHeading>
      <LiveEditor code={example} scope={{CaretBox}} />
    </div>
  )
}

export default CaretBoxExample
