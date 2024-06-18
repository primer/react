import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import type {AvatarProps} from './Avatar'
import Avatar, {DEFAULT_AVATAR_SIZE} from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
}

export default meta

type Args = {
  size?: number | {narrow?: number; regular?: number; wide?: number}
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
  square?: boolean
  src: string
  asButton?: boolean
} & Omit<AvatarProps, 'size'>

export const Default = () => <Avatar src="https://avatars.githubusercontent.com/u/92997159?v=4" />

export const Playground: StoryFn<Args> = args => {
  const size = {
    narrow: args.sizeAtNarrow,
    regular: args.sizeAtRegular,
    wide: args.sizeAtWide,
  }
  return (
    <Avatar
      size={size}
      square={args.square}
      src="https://avatars.githubusercontent.com/u/92997159?v=4"
      asButton={args.asButton}
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
    control: false,
    table: {
      disable: true,
    },
  },
  asButton: {
    control: {
      type: 'boolean',
    },
  },
}
