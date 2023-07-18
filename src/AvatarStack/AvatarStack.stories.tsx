import React from 'react'
import {ComponentMeta, Story} from '@storybook/react'
import AvatarStack, {AvatarStackProps} from './AvatarStack'
import Avatar from '../Avatar'
import {parseSizeFromArgs} from '../Avatar/storyHelpers'

export default {
  title: 'Components/AvatarStack',
  component: AvatarStack,
} as ComponentMeta<typeof AvatarStack>

type Args = {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
} & Omit<AvatarStackProps, 'size'>

export const Default = () => (
  <AvatarStack>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

export const Playground: Story<Args> = args => (
  <AvatarStack size={parseSizeFromArgs(args)} alignRight={args.alignRight} disableExpand={args.disableExpand}>
    <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
    <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
    <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
    <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
  </AvatarStack>
)

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
  sx: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
