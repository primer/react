import * as PrimerReactLibrary from '../index'
import * as storyHelpers from './storyHelpers'
import {makeLiveEditStory} from 'storybook-addon-code-editor'
import type {Meta, StoryObj} from '@storybook/react'
import storyCode from './Avatar.source.tsx?raw'
import {Avatar, type AvatarProps} from '../index'

export default {
  title: 'Components/Avatar',
  component: Avatar,
} as Meta<typeof Avatar>

export const Default = () => <Avatar alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />

const DEFAULT_AVATAR_SIZE = 20

type Args = {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
} & Omit<AvatarProps, 'size'>

export const Playground: StoryObj<Args> = {
  // Story config
  args: {
    size: DEFAULT_AVATAR_SIZE,
  },
  argTypes: {
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
  },
}

makeLiveEditStory(Playground, {
  availableImports: {'@primer/react': PrimerReactLibrary, storyHelpers},
  code: storyCode,
})
