import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Text} from '../../src'

const TextExample = {
  name: 'Text',
  element: (
    <div>
      <LiveEditor code={`<Text tag="div">Text</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text tag="div" fontWeight="bold">Text bold</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text tag="div" color="green">Text green</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text tag="div" lineHeight="condensed">Text lineHeight 'condensed'</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text tag="div" fontSize={4}>Text fontSize 4</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text tag="div" p={4}>Text padding 4</Text>`} scope={{Text}} />
    </div>
  )
}

export default TextExample
