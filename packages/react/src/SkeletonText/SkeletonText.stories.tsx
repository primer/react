import type {Meta, StoryFn} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {SkeletonText} from './SkeletonText'

export default {
  title: 'Components/Skeleton/SkeletonText',
  component: SkeletonText,
} as Meta<ComponentProps<typeof SkeletonText>>

export const Default = () => <SkeletonText />

export const Playground: StoryFn<ComponentProps<typeof SkeletonText>> = args => <SkeletonText {...args} />

Playground.args = {
  size: 'bodyMedium',
  lines: 1,
}

Playground.argTypes = {
  lines: {
    control: {type: 'range', min: 1, max: 10, step: 1},
  },
  maxWidth: {
    type: 'string',
  },
  size: {
    control: {
      type: 'select',
    },
    options: ['bodySmall', 'bodyMedium', 'bodyLarge', 'titleSmall', 'titleMedium', 'titleLarge', 'display', 'subtitle'],
  },
}
