import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../../utils/types'
import {SkeletonBox} from './SkeletonBox'

export default {
  title: 'Drafts/Components/Skeleton/SkeletonBox/Features',
  component: SkeletonBox,
} as Meta<ComponentProps<typeof SkeletonBox>>

export const CustomHeight = () => <SkeletonBox height="4rem" />

export const CustomWidth = () => <SkeletonBox width="300px" />
