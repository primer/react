import React from 'react'
import {Meta, Story} from '@storybook/react'
import {ComponentProps} from '../../utils/types'
import {SkeletonBone} from './SkeletonBone'

export default {
  title: 'Drafts/Components/Skeleton/SkeletonBone',
  component: SkeletonBone,
} as Meta<ComponentProps<typeof SkeletonBone>>

export const Default = () => <SkeletonBone />

export const Playground: Story<ComponentProps<typeof SkeletonBone>> = args => <SkeletonBone {...args} />

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
