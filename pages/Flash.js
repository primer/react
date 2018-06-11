import React from 'react'
import {Block, Flash} from '../src'

export default () => (
  <Block>
    <Block mb={3}>
      <Flash> Flash </Flash>
    </Block>
    <Block mb={3}>
      <Flash yellow> Flash yellow </Flash>
    </Block>
    <Block mb={3}>
      <Flash red> Flash red </Flash>
    </Block>
    <Block mb={3}>
      <Flash green> Flash green </Flash>
    </Block>
    <Block mb={3}>
      <Flash full> Flash full </Flash>
    </Block>
  </Block>
)
