import React from 'react'
import type {StoryFn, Meta} from '@storybook/react'
import PointerBox from './PointerBox'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/PointerBox',
} as Meta<typeof PointerBox>

export const Default = () => <PointerBox>Pointer box content</PointerBox>

export const Playground: StoryFn<ComponentProps<typeof PointerBox>> = args => (
  <PointerBox {...args}>Pointer box content</PointerBox>
)
Playground.args = {
  caret: 'top',
}
Playground.argTypes = {
  caret: {
    control: {
      type: 'radio',
    },
    options: [
      'top',
      'top-left',
      'top-right',
      'right',
      'right-top',
      'right-bottom',
      'bottom',
      'bottom-left',
      'bottom-right',
      'left',
      'left-top',
      'left-bottom',
    ],
  },
  bg: {
    control: 'color',
  },
  borderColor: {
    control: 'color',
  },
  border: {
    control: 'number',
  },
}
