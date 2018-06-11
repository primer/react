import React from 'react'
import {Block, TextInput} from '../src'
import {ExampleHeading} from './_helpers'

export default () => (
  <Block>
    <Block mb={2}>
      <ExampleHeading>Input</ExampleHeading>
      <TextInput name='zipcode'/>
    </Block>
    <Block mb={2}>
      <ExampleHeading>Input Sizes</ExampleHeading>
      <TextInput name='zipcode' size='small' placeholder='Small input'/>
    </Block>
    <Block mb={2}>
      <TextInput name='zipcode' size='large' placeholder='Large input'/>
    </Block>
    <Block mb={2}>
      <ExampleHeading>Block input</ExampleHeading>
      <TextInput block placeholder='Full width block input'/>
    </Block>
  </Block>
)
