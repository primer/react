import {type ComponentProps} from 'react'
import type {Meta} from '@storybook/react-vite'
import {SkeletonBox} from './SkeletonBox'

export default {
  title: 'Components/Skeleton/SkeletonBox/Features',
  component: SkeletonBox,
} as Meta<ComponentProps<typeof SkeletonBox>>

export const CustomHeight = () => <SkeletonBox height="4rem" />

export const CustomWidth = () => <SkeletonBox width="300px" />

export const WithDelay = () => <SkeletonBox delay />
