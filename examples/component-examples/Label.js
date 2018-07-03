/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import {Block, Label} from '../../src'

const LabelExample = {
  name: 'Label',
  element: (
    <div>
      <Block mb={3}>
        <Label>Default label</Label>
        <Label scheme="gray-darker">Darker gray label</Label>
        <Label scheme="orange">Orange label</Label>
        <Label scheme="green">Green label</Label>
      </Block>
      <Block mb={3}>
        <Label outline>Default outline label</Label>
        <Label outline scheme="green">
          Green outline label
        </Label>
      </Block>
    </div>
  )
}

export default LabelExample
