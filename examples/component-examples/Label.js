/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, Label} from '../../src'

const LabelExample = {
  name: 'Label',
  element: (
    <div>
      <Block mb={3}>
        <LiveEditor code={`<Label>Default label</Label>`} scope={{Label}} />
        <LiveEditor code={`<Label scheme="gray-darker">Darker gray label</Label>`} scope={{Label}} />
        <LiveEditor code={`<Label scheme="orange">Orange label</Label>`} scope={{Label}} />
        <LiveEditor code={`<Label scheme="green">Green label</Label>`} scope={{Label}} />
      </Block>
      <Block mb={3}>
        <LiveEditor code={`<Label outline>Default outline label</Label>`} scope={{Label}} />
        <LiveEditor code={`<Label outline scheme="green">Green outline label</Label>`} scope={{Label}} />
      </Block>
    </div>
  )
}

export default LabelExample
