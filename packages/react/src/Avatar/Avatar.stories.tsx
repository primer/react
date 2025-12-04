import {parseSizeFromArgs} from './storyHelpers'
import playgroundStoryCode from './StorySources/Avatar.playground.source.tsx?raw'
import defaultStoryCode from './StorySources/Avatar.default.source.tsx?raw'
import Avatar, {type AvatarProps, DEFAULT_AVATAR_SIZE} from './Avatar'
import type {Meta, StoryObj} from '@storybook/react-vite'
// eslint-disable-next-line import/no-namespace
import * as PrimerReactLibrary from '../index'

// Conditionally import live editor with error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let makeLiveEditStory: any = null
try {
  const liveEditor = await import('storybook-addon-code-editor')
  makeLiveEditStory = liveEditor.makeLiveEditStory
} catch {
  // Live editor not available or broken - continue without it
}

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

export const Default: StoryObj = {
  parameters: {
    controls: {expanded: true},
  },
  argTypes: {
    size: {
      control: false,
    },
    square: {
      control: false,
    },
    src: {
      control: false,
    },
    alt: {
      control: false,
    },
    className: {
      control: false,
    },
  },
}

// Enable live editor if available
if (makeLiveEditStory) {
  makeLiveEditStory(Default, {
    availableImports: {'../../index': PrimerReactLibrary},
    code: defaultStoryCode,
  })

  makeLiveEditStory(Playground, {
    availableImports: {'../../index': PrimerReactLibrary, '../storyHelpers': {parseSizeFromArgs}},
    code: playgroundStoryCode,
  })
}
