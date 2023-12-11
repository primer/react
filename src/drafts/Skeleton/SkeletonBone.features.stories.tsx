import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../../utils/types'
import {SkeletonBone} from './SkeletonBone'

export default {
  title: 'Drafts/Components/Skeleton/SkeletonBone/Features',
  component: SkeletonBone,
} as Meta<ComponentProps<typeof SkeletonBone>>

export const CustomHeight = () => <SkeletonBone height="4rem" />

export const CustomWidth = () => <SkeletonBone width="300px" />
