import React from 'react'
import {SxProp, merge} from '../../sx'
import {BaseSkeletonBone} from './_BaseSkeletonBone'
import Box from '../../Box'

type SkeletonTextProps = {
  /** Size of the text that the skeleton is replacing. */
  size?: 'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'subtitle'
  /** Number of lines of skeleton text to render. */
  lines?: number
  /** Maximum width that the line(s) of skeleton text can take up.  Accepts any valid CSS `max-width` value. */
  maxWidth?: React.CSSProperties['maxWidth']
}

export const SkeletonText: React.FC<SkeletonTextProps & SxProp> = ({
  lines = 1,
  maxWidth,
  size = 'bodyMedium',
  sx: sxProp = {},
  ...rest
}) => {
  return lines < 2 ? (
    <BaseSkeletonBone
      data-component="SkeletonText"
      data-text-skeleton-size={size}
      width="100%"
      sx={merge({maxWidth} as React.CSSProperties, sxProp as SxProp)}
      {...rest}
    />
  ) : (
    <Box
      data-component="multilineContainer"
      sx={merge(
        {
          maxWidth,
          /* The tiny `paddingBlock` prevents margin collapse between the first skeleton line
           * and a bottom margin above it.
           */
          paddingBlock: '0.1px',
        } as React.CSSProperties,
        sxProp as SxProp,
      )}
    >
      {Array.from({length: lines}, (_, index) => (
        <BaseSkeletonBone
          key={index}
          data-component="SkeletonText"
          data-in-multiline="true"
          data-text-skeleton-size={size}
          {...rest}
        />
      ))}
    </Box>
  )
}
