import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import type {ComponentProps} from '../../utils/types'
import {SkeletonBox} from './SkeletonBox'

export default {
  title: 'Drafts/Components/Skeleton/SkeletonBox',
  component: SkeletonBox,
} as Meta<ComponentProps<typeof SkeletonBox>>

export const Default = () => <SkeletonBox />

export const Playground: StoryFn<ComponentProps<typeof SkeletonBox>> = args => <SkeletonBox {...args} />

Playground.argTypes = {
  sx: {
    controls: false,
    table: {
      disable: true,
    },
  },
  height: {
    type: 'string',
  },
  width: {
    type: 'string',
  },
}
