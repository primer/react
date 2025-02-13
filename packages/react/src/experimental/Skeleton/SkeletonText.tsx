import React, {type CSSProperties, type HTMLProps} from 'react'
import Box from '../../Box'
import {SkeletonBox} from './'
import classes from './SkeletonText.module.css'
import {useFeatureFlag} from '../../FeatureFlags'
import {clsx} from 'clsx'
import {merge} from '../../sx'
import {CSS_MODULE_FLAG} from './FeatureFlag'

type SkeletonTextProps = {
  /** Size of the text that the skeleton is replacing. */
  size?: 'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'subtitle'
  /** Number of lines of skeleton text to render. */
  lines?: number
  /** Maximum width that the line(s) of skeleton text can take up.  Accepts any valid CSS `max-width` value. */
  maxWidth?: React.CSSProperties['maxWidth']
  /** Class name for custom styling */
  className?: string
} & Omit<HTMLProps<HTMLDivElement>, 'size'>

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  maxWidth,
  size = 'bodyMedium',
  className,
  style,
  ...rest
}) => {
  const enabled = useFeatureFlag(CSS_MODULE_FLAG)

  if (lines < 2) {
    // TODO: fix
    return (
      <SkeletonBox
        data-component="SkeletonText"
        data-text-skeleton-size={size}
        width="100%"
        className={clsx(className, {[classes.SkeletonText]: enabled})}
        style={enabled ? merge(style as CSSProperties, {maxWidth} as CSSProperties) : style}
        {...rest}
      />
    )
  } else {
    return (
      <Box
        data-component="multilineContainer"
        sx={{
          maxWidth,
          /* The tiny `paddingBlock` prevents margin collapse between the first skeleton line
           * and a bottom margin above it.
           */
          paddingBlock: '0.1px',
        }}
        style={enabled ? merge(style as CSSProperties, {maxWidth, paddingBlock: '0.1px'} as CSSProperties) : style}
      >
        {Array.from({length: lines}, (_, index) => (
          // TODO: fix
          <SkeletonBox
            key={index}
            data-component="SkeletonText"
            data-in-multiline="true"
            data-text-skeleton-size={size}
            className={clsx(className, {[classes.SkeletonText]: enabled})}
            {...rest}
          />
        ))}
      </Box>
    )
  }
}
