import React from 'react'
import {Block, Flash} from '../../src'

const FlashExample = {
  name: 'Flash',
  element: (
    <div>
      <Block mb={3}>
        <Flash> Flash </Flash>
      </Block>
      <Block mb={3}>
        <Flash scheme="yellow"> Flash yellow </Flash>
      </Block>
      <Block mb={3}>
        <Flash scheme="red"> Flash red </Flash>
      </Block>
      <Block mb={3}>
        <Flash scheme="green"> Flash green </Flash>
      </Block>
      <Block mb={3}>
        <Flash full> Flash full </Flash>
      </Block>
    </div>
  )
}

export default FlashExample
