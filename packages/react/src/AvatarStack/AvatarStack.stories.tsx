import type {Meta, StoryFn} from '@storybook/react-vite'
import type {AvatarStackProps} from './AvatarStack'
import AvatarStack from './AvatarStack'
import Avatar from '../Avatar'
import {parseSizeFromArgs} from '../Avatar/storyHelpers'

export default {
  title: 'Components/AvatarStack',
  component: AvatarStack,
} as Meta<typeof AvatarStack>

type Args = {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
} & Omit<AvatarStackProps, 'size'>

export const Default = () => (
  <AvatarStack>
    <Avatar alt="Primer logo" src="/avatars/primer.png" />
    <Avatar alt="GitHub logo" src="/avatars/github.png" />
    <Avatar alt="Atom logo" src="/avatars/atom.png" />
    <Avatar alt="GitHub Desktop logo" src="/avatars/desktop.png" />
  </AvatarStack>
)

export const Playground: StoryFn<Args> = args => (
  <AvatarStack
    size={parseSizeFromArgs(args)}
    alignRight={args.alignRight}
    disableExpand={args.disableExpand}
    variant={args.variant}
    shape={args.shape}
  >
    <Avatar alt="Primer logo" src="/avatars/primer.png" />
    <Avatar alt="GitHub logo" src="/avatars/github.png" />
    <Avatar alt="Atom logo" src="/avatars/atom.png" />
    <Avatar alt="GitHub Desktop logo" src="/avatars/desktop.png" />
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
}
