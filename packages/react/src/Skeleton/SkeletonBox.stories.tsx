import type {Meta, StoryFn} from '@storybook/react'
import {SkeletonBox} from './SkeletonBox'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/Skeleton/SkeletonBox',
  component: SkeletonBox,
} as Meta<ComponentProps<typeof SkeletonBox>>

export const Default = () => <SkeletonBox />

export const Playground: StoryFn<ComponentProps<typeof SkeletonBox>> = args => <SkeletonBox {...args} />

Playground.argTypes = {
  height: {
    type: 'string',
  },
  width: {
    type: 'string',
  },
}
