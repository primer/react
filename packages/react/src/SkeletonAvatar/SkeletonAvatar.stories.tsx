import type {Meta, StoryFn} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {SkeletonAvatar, type SkeletonAvatarProps} from './SkeletonAvatar'
import {parseSizeFromArgs} from '../Avatar/storyHelpers'
import {DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'

export default {
  title: 'Components/Skeleton/SkeletonAvatar',
  component: SkeletonAvatar,
} as Meta<ComponentProps<typeof SkeletonAvatar>>

type Args = {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
} & Omit<SkeletonAvatarProps, 'size'>

export const Default = () => <SkeletonAvatar />

export const Playground: StoryFn<Args> = args => {
  return <SkeletonAvatar size={parseSizeFromArgs(args)} square={args.square} />
}

Playground.args = {
  size: DEFAULT_AVATAR_SIZE,
  square: false,
}

Playground.argTypes = {
  square: {
    control: {
      type: 'boolean',
    },
  },
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
}
