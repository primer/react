import React, {type CSSProperties, type HTMLProps} from 'react'
import classes from './SkeletonText.module.css'
import {clsx} from 'clsx'
import {merge} from '../../sx'
import SkeletonBox from '../../Skeleton'

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
  if (lines < 2) {
    return (
      <SkeletonBox
        data-component="SkeletonText"
        data-text-skeleton-size={size}
        width="100%"
        className={clsx(className, classes.SkeletonText)}
        style={merge(style as CSSProperties, {maxWidth} as CSSProperties)}
        {...rest}
      />
    )
  } else {
    return (
      <div
        data-component="multilineContainer"
        className={classes.SkeletonTextWrapper}
        style={merge(style as CSSProperties, {maxWidth} as CSSProperties)}
      >
        {Array.from({length: lines}, (_, index) => (
          <SkeletonBox
            key={index}
            data-component="SkeletonText"
            data-in-multiline="true"
            data-text-skeleton-size={size}
            className={clsx(className, classes.SkeletonText)}
            {...rest}
          />
        ))}
      </div>
    )
  }
}
