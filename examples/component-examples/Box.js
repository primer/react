import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box, Block} from '../../src'

const BoxExample = {
  name: 'Box',
  element: (
    <div>
      <Block mb={6}>
        <LiveEditor code={`<Box>This is a box</Box>`} scope={{Box}} />
      </Block>
      <Block mb={6}>
        <LiveEditor code={`<Box p={2}>This is a box with padding.</Box>`} scope={{Box}} />
      </Block>
      <Block mb={6}>
        <LiveEditor code={`<Box shadow="small" p={2}>This is a box with shadow.</Box>`} scope={{Box}} />
      </Block>
      <Block mb={6}>
        <LiveEditor code={`<Box shadow="medium" p={2}>This is a box with a medium shadow.</Box>`} scope={{Box}} />
      </Block>
      <Block mb={6}>
        <LiveEditor code={`<Box shadow="large" p={2}>This is a box with a large shadow.</Box>`} scope={{Box}} />
      </Block>
      <Block mb={6}>
        <LiveEditor
          code={`<Box shadow="extra-large" p={2}>This is a box with an extra-large shadow.</Box>`}
          scope={{Box}}
        />
      </Block>
      <Block mb={6}>
        <LiveEditor code={`<Box borderColor="green" p={2}>This is a box with a green border.</Box>`} scope={{Box}} />
      </Block>
    </div>
  )
}

export default BoxExample
