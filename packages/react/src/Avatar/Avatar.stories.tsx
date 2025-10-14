import type {Meta, StoryFn} from '@storybook/react-vite'
import type {AvatarProps} from './Avatar'
import Avatar, {DEFAULT_AVATAR_SIZE} from './Avatar'
import {parseSizeFromArgs} from './storyHelpers'
import {makeLiveEditStory} from 'storybook-addon-code-editor'
import * as PrimerReactLibrary from '../index';

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

export const Default = {}

makeLiveEditStory(Default, {
  availableImports: {'@primer/react': PrimerReactLibrary},
  code: `import { Avatar } from '@primer/react';

    export default () => <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" />`,
})

export const Playground = {}

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

makeLiveEditStory(Playground, {
  availableImports: {'@primer/react': PrimerReactLibrary},
  code: `import { Avatar } from '@primer/react';

export default (args) => (
  <Avatar
    size={args.size || 24}
    square={args.square}
    src="https://avatars.githubusercontent.com/u/7143434?v=4"
    alt="mona"
  />
);`,
})
