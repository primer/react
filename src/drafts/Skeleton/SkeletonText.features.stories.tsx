import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../../utils/types'
import {SkeletonText} from './SkeletonText'
import {Box, Text} from '../..'

export default {
  title: 'Drafts/Components/Skeleton/SkeletonText',
  component: SkeletonText,
} as Meta<ComponentProps<typeof SkeletonText>>

export const Default = () => <SkeletonText />

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

export const TextTest = () => {
  return (
    <Box sx={{display: 'grid', '> *': {gridRow: 1, gridColumn: 1}}}>
      <SkeletonText lines={2} />
      <Text sx={{fontSize: 'var(--text-body-size-medium)', lineHeight: 'var(--text-body-lineHeight-medium)'}}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
        a type specimen book.
      </Text>
    </Box>
  )
}
