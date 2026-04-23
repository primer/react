import type {Meta, StoryFn} from '@storybook/react-vite'
import type {AvatarProps} from './Avatar'
import Avatar, {DEFAULT_AVATAR_SIZE} from './Avatar'
import {parseSizeFromArgs} from './storyHelpers'

export default {
  title: 'Components/Avatar',
  component: Avatar,
} as Meta<typeof Avatar>

type Args = {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
} & Omit<AvatarProps, 'size'>

export const Default = () => <Avatar src="/avatars/mona.png" />

export const Playground: StoryFn<Args> = args => {
  return <Avatar size={parseSizeFromArgs(args)} square={args.square} src="/avatars/mona.png" alt="mona" />
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
}
