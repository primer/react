import React from 'react'
import {ComponentMeta, Story} from '@storybook/react'
import Avatar, {AvatarProps, DEFAULT_AVATAR_SIZE} from './Avatar'
import {parseSizeFromArgs} from './storyHelpers'

export default {
  title: 'Components/Avatar',
  component: Avatar,
} as ComponentMeta<typeof Avatar>

type Args = {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
} & Omit<AvatarProps, 'size'>

export const Default = () => <Avatar src="https://avatars.githubusercontent.com/u/92997159?v=4" />

export const Playground: Story<Args> = args => {
  return (
    <Avatar
      size={parseSizeFromArgs(args)}
      square={args.square}
      src="https://avatars.githubusercontent.com/u/92997159?v=4"
    />
  )
}

Playground.args = {
  size: DEFAULT_AVATAR_SIZE,
}

Playground.argTypes = {
  size: {
    control: {
      type: 'number',
    },
  },
  sizeAtNarrow: {
    name: 'size.narrow',
    control: {
      type: 'number',
    },
  },
  sizeAtRegular: {
    name: 'size.regular',
    control: {
      type: 'number',
    },
  },
  sizeAtWide: {
    name: 'size.wide',
    control: {
      type: 'number',
    },
  },
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
