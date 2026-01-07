import type {Meta, StoryFn} from '@storybook/react-vite'
import {SkeletonBox} from './SkeletonBox'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/Skeleton/SkeletonBox',
  component: SkeletonBox,
} as Meta<ComponentProps<typeof SkeletonBox>>

export const Default = () => <SkeletonBox />

export const Playground: StoryFn<ComponentProps<typeof SkeletonBox>> = args => <SkeletonBox {...args} />

Playground.argTypes = {
  delay: {
    type: 'number',
  },
  height: {
    type: 'string',
  },
  width: {
    type: 'string',
  },
}
