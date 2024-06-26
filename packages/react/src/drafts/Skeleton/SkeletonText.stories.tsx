import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import type {ComponentProps} from '../../utils/types'
import {SkeletonText} from './SkeletonText'

export default {
  title: 'Drafts/Components/Skeleton/SkeletonText',
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
    type: 'number',
  },
  maxWidth: {
    type: 'string',
  },
  size: {
    type: 'string',
  },
}
