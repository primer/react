import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import Flash from './Flash'
import {CheckIcon} from '@primer/octicons-react'
import Octicon from '../Octicon/Octicon'

export default {
  title: 'Components/Flash',
  component: Flash,
} as ComponentMeta<typeof Flash>

export const Default = () => (
  <Flash>
    <Octicon icon={CheckIcon} />
    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its
    layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to
  </Flash>
)

export const Playground: ComponentStory<typeof Flash> = args => <Flash {...args}>Default</Flash>

Playground.args = {
  variant: 'default',
}

Playground.argTypes = {
  as: {
    controls: false,
    table: {
      disable: true,
    },
  },
  ref: {
    controls: false,
    table: {
      disable: true,
    },
  },
  sx: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
