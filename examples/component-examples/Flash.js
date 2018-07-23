import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, Flash} from '../../src'

const FlashExample = {
  name: 'Flash',
  element: (
    <div>
      <Block mb={3}>
        <LiveEditor code={`<Flash> Flash </Flash>`} scope={{Flash}}/>
      </Block>
      <Block mb={3}>
        <LiveEditor code={`<Flash scheme="yellow"> Flash yellow </Flash>`} scope={{Flash}}/>
      </Block>
      <Block mb={3}>
        <LiveEditor code={`<Flash scheme="red"> Flash red </Flash>`} scope={{Flash}}/>
      </Block>
      <Block mb={3}>
        <LiveEditor code={`<Flash scheme="green"> Flash green </Flash>`} scope={{Flash}}/>
      </Block>
      <Block mb={3}>
        <LiveEditor code={`<Flash full> Flash full </Flash>`} scope={{Flash}}/>
      </Block>
    </div>
  )
}

export default FlashExample
