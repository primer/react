import React from 'react'
import { TextInput, Box, } from '../../src'
import ExampleHeading from '../ExampleHeading'

const FormExample =
  {
    name: 'Form elements',
    element: (
      <div>
        <ExampleHeading>Input</ExampleHeading>
        <TextInput name='zipcode'/>
        <ExampleHeading>Input Sizes</ExampleHeading>
        <Box>
          <TextInput name='zipcode' size='small' placeholder='Small input'/>
        </Box>
        <Box>
          <TextInput name='zipcode' size='large' placeholder='Large input'/>
        </Box>
        <ExampleHeading>Block input</ExampleHeading>
        <TextInput block placeholder='Full width block input'/>
      </div>
    )
  }
export default FormExample
