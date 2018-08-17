import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {TextInput} from '../../src'
import {ExampleHeading} from '../doc-components'

const TextInputExample = {
  name: 'TextInput',
  element: (
    <div>
      <ExampleHeading>Text Input</ExampleHeading>
      <LiveEditor code={`<TextInput name="zipcode" />`} scope={{TextInput}} />
      <ExampleHeading>Text Input Sizes</ExampleHeading>
      <LiveEditor code={`<TextInput name="zipcode" size="small" placeholder="Small input" />`} scope={{TextInput}} />
      <LiveEditor code={`<TextInput name="zipcode" size="large" placeholder="Large input" />`} scope={{TextInput}} />
      <ExampleHeading>Text Input - Block</ExampleHeading>
      <LiveEditor code={`<TextInput block placeholder="Full width block input" />`} scope={{TextInput}} />
    </div>
  )
}
export default TextInputExample
