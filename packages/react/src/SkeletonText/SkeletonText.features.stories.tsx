import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {SkeletonText} from './SkeletonText'

export default {
  title: 'Components/Skeleton/SkeletonText/Features',
  component: SkeletonText,
} as Meta<ComponentProps<typeof SkeletonText>>

export const WithMaxWidth = () => <SkeletonText maxWidth={200} />

export const WithMultipleLines = () => <SkeletonText lines={3} />

export const Display = () => <SkeletonText size="display" />

export const Subtitle = () => <SkeletonText size="subtitle" />

export const TitleLarge = () => <SkeletonText size="titleLarge" />

export const TitleMedium = () => <SkeletonText size="titleMedium" />

export const TitleSmall = () => <SkeletonText size="titleSmall" />

export const BodyLarge = () => <SkeletonText size="bodyLarge" />

export const BodyMedium = () => <SkeletonText size="bodyMedium" />

export const BodySmall = () => <SkeletonText size="bodySmall" />
