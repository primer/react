import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import Heading from '../Heading'
import Popover from './Popover'
import Text from '../Text'
import {Button} from '../Button'

export default {
  title: 'Components/Popover',
  component: Popover,
} as Meta<typeof Popover>

export const Default = () => (
  <Popover relative open={true} caret="top">
    <Popover.Content sx={{marginTop: 2}}>
      <Heading sx={{fontSize: 2}}>Popover heading</Heading>
      <Text as="p">Message about popovers</Text>
      <Button>Got it!</Button>
    </Popover.Content>
  </Popover>
)

export const Playground: StoryFn<typeof Popover> = args => (
  <Popover {...args}>
    <Popover.Content sx={{marginTop: 2}}>
      <Heading sx={{fontSize: 2}}>Popover heading</Heading>
      <Text as="p">Message about popovers</Text>
      <Button>Got it!</Button>
    </Popover.Content>
  </Popover>
)

Playground.args = {
  caret: 'top',
  open: true,
  relative: true,
}

Playground.argTypes = {
  caret: {
    control: {
      type: 'radio',
    },
    options: [
      'top',
      'bottom',
      'left',
      'right',
      'bottom-left',
      'bottom-right',
      'top-left',
      'top-right',
      'left-bottom',
      'left-top',
      'right-bottom',
      'right-top',
    ],
  },
  open: {
    control: {
      type: 'boolean',
    },
  },
  relative: {
    control: {
      type: 'boolean',
    },
  },
}
