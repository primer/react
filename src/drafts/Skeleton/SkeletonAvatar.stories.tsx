import React from 'react'
import {Meta, Story} from '@storybook/react'
import {ComponentProps} from '../../utils/types'
import {SkeletonAvatar, SkeletonAvatarProps} from './SkeletonAvatar'
import {parseSizeFromArgs} from '../../Avatar/storyHelpers'
import {DEFAULT_AVATAR_SIZE} from '../../Avatar/Avatar'

export default {
  title: 'Drafts/Components/Skeleton/SkeletonAvatar',
  component: SkeletonAvatar,
} as Meta<ComponentProps<typeof SkeletonAvatar>>

type Args = {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
} & Omit<SkeletonAvatarProps, 'size'>

export const Default = () => <SkeletonAvatar />

export const Playground: Story<Args> = args => {
  return <SkeletonAvatar size={parseSizeFromArgs(args)} square={args.square} />
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
}
