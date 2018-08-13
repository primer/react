import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Text} from '../../src'

const TextExample = {
  name: 'Text',
  element: (
    <div>
      <LiveEditor code={`<Text is="div">Text</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text is="div" fontWeight="bold">Text bold</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text is="div" color="green.5">Text green</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text is="div" lineHeight="condensed">Text lineHeight 'condensed'</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text is="div" fontSize={4}>Text fontSize 4</Text>`} scope={{Text}} />
      <LiveEditor code={`<Text is="div" p={4}>Text padding 4</Text>`} scope={{Text}} />
    </div>
  )
}

export default TextExample
