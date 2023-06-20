import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import Avatar from './Avatar'

export default {
  title: 'Components/Avatar',
  component: Avatar,
} as ComponentMeta<typeof Avatar>

export const Default = () => <Avatar src="https://avatars.githubusercontent.com/u/92997159?v=4" />

export const Playground: ComponentStory<typeof Avatar> = args => (
  <Avatar {...args} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
)

Playground.args = {
  size: 20,
}

Playground.argTypes = {
  alt: {
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
