import React from 'react'
import {Block, Label} from '../src'

export default () => (
  <Block>
    <Block mb={3}>
      <Label>Default label</Label>
      <Label scheme='gray-darker'>Darker gray label</Label>
      <Label scheme='orange'>Orange label</Label>
      <Label scheme='green'>Green label</Label>
    </Block>
    <Block mb={3}>
      <Label outline>Default outline label</Label>
      <Label outline scheme='green'>Green outline label</Label>
    </Block>
  </Block>
)
