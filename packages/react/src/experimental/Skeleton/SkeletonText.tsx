import React from 'react'
import Box from '../../Box'
import {SkeletonBox} from './SkeletonBox'

type SkeletonTextProps = {
  /** Size of the text that the skeleton is replacing. */
  size?: 'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'subtitle'
  /** Number of lines of skeleton text to render. */
  lines?: number
  /** Maximum width that the line(s) of skeleton text can take up.  Accepts any valid CSS `max-width` value. */
  maxWidth?: React.CSSProperties['maxWidth']
  /** Class name for custom styling */
  className?: string
}

const skeletonTextStyles = {
  '&[data-component="SkeletonText"]': {
    '--font-size': 'var(--text-body-size-medium, 0.875rem)',
    '--line-height': 'var(--text-body-lineHeight-medium, 1.4285)',
    '--leading': 'calc(var(--font-size) * var(--line-height) - var(--font-size))',
    borderRadius: 'var(--borderRadius-small, 0.1875rem)',
    height: 'var(--font-size)',
    marginBlock: 'calc(var(--leading) / 2)',
  },
  '&[data-in-multiline="true"]': {
    marginBlockEnd: 'calc(var(--leading) * 2)',
  },
  '&[data-in-multiline="true"]:last-child': {
    maxWidth: '65%',
    minWidth: '50px',
    marginBottom: 0,
  },
  '@supports (margin-block: mod(1px, 1px))': {
    '&[data-component="SkeletonText"]': {
      '--leading': 'mod(var(--font-size) * var(--line-height), var(--font-size))',
    },
  },
  '&[data-text-skeleton-size="display"], &[data-text-skeleton-size="titleLarge"]': {
    borderRadius: 'var(--borderRadius-medium, 0.375rem)',
  },
  '&[data-text-skeleton-size="display"]': {
    '--font-size': 'var(--text-display-size, 2.5rem)',
    '--line-height': 'var(--text-display-lineHeight, 1.4)',
  },
  '&[data-text-skeleton-size="titleLarge"]': {
    '--font-size': 'var(--text-title-size-large, 2.5rem)',
    '--line-height': 'var(--text-title-lineHeight-large, 1.5)',
  },
  '&[data-text-skeleton-size="titleMedium"]': {
    '--font-size': 'var(--text-title-size-medium, 1.25rem)',
    '--line-height': 'var(--text-title-lineHeight-medium, 1.6)',
  },
  '&[data-text-skeleton-size="titleSmall"]': {
    '--font-size': 'var(--text-title-size-small, 1rem)',
    '--line-height': 'var(--text-title-lineHeight-small, 1.5)',
  },
  '&[data-text-skeleton-size="subtitle"]': {
    '--font-size': 'var(--text-subtitle-size, 1.25rem)',
    '--line-height': 'var(--text-subtitle-lineHeight, 1.6)',
  },
  '&[data-text-skeleton-size="bodyLarge"]': {
    '--font-size': 'var(--text-body-size-large, 1rem)',
    '--line-height': 'var(--text-body-lineHeight-large, 1.5)',
  },
  '&[data-text-skeleton-size="bodySmall"]': {
    '--font-size': 'var(--text-body-size-small, 0.75rem)',
    '--line-height': 'var(--text-body-lineHeight-small, 1.6666)',
  },
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({lines = 1, maxWidth, size = 'bodyMedium', ...rest}) => {
  return lines < 2 ? (
    <SkeletonBox
      data-component="SkeletonText"
      data-text-skeleton-size={size}
      width="100%"
      sx={{
        maxWidth,
        ...skeletonTextStyles,
      }}
      {...rest}
    />
  ) : (
    <Box
      data-component="multilineContainer"
      sx={{
        maxWidth,
        /* The tiny `paddingBlock` prevents margin collapse between the first skeleton line
         * and a bottom margin above it.
         */
        paddingBlock: '0.1px',
      }}
    >
      {Array.from({length: lines}, (_, index) => (
        <SkeletonBox
          key={index}
          data-component="SkeletonText"
          data-in-multiline="true"
          data-text-skeleton-size={size}
          sx={skeletonTextStyles}
          {...rest}
        />
      ))}
    </Box>
  )
}
