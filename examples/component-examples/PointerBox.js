import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {PointerBox} from '../../src'
import {ExampleHeading} from '../doc-components'

const example = `<PointerBox m={4} p={2} minHeight={100} bg="green.1" borderColor="green.5">
  PointerBox
</PointerBox>`

const PointerBoxExample = {
  name: 'PointerBox',
  element: (
    <div>
      <ExampleHeading mt={2}>PointerBox</ExampleHeading>
      <LiveEditor code={example} scope={{PointerBox}} />
    </div>
  )
}

export default PointerBoxExample
