import {parseSizeFromArgs} from './storyHelpers'
import {makeLiveEditStory} from 'storybook-addon-code-editor'
// @ts-expect-error -- this is fine
import playgroundStoryCode from './Avatar.playground.source.tsx?raw'
// @ts-expect-error -- this is fine
import defaultStoryCode from './Avatar.default.source.tsx?raw'
import Avatar, {type AvatarProps, DEFAULT_AVATAR_SIZE} from './Avatar'
import type {Meta, StoryObj} from '@storybook/react-vite'
// eslint-disable-next-line import/no-namespace
import * as PrimerReactLibrary from '../index'

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

export const Default: StoryObj = {}

makeLiveEditStory(Default, {
  availableImports: {'@primer/react': PrimerReactLibrary},
  code: defaultStoryCode,
})

makeLiveEditStory(Playground, {
  availableImports: {'@primer/react': PrimerReactLibrary, './storyHelpers': {parseSizeFromArgs}},
  code: playgroundStoryCode,
})
