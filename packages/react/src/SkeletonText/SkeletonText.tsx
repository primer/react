import type React from 'react'
import {type HTMLProps} from 'react'
import classes from './SkeletonText.module.css'
import {clsx} from 'clsx'
import {SkeletonBox} from '../Skeleton'

interface SkeletonTextProps extends Omit<HTMLProps<HTMLElement>, 'size'> {
  /** Size of the text that the skeleton is replacing. */
  size?: 'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'subtitle'
  /** Number of lines of skeleton text to render. */
  lines?: number
  /** Maximum width that the line(s) of skeleton text can take up.  Accepts any valid CSS `max-width` value. */
  maxWidth?: React.CSSProperties['maxWidth']
  /** Class name for custom styling */
  className?: string
}

function SkeletonText({lines = 1, maxWidth, size = 'bodyMedium', className, style, ...rest}: SkeletonTextProps) {
  if (lines < 2) {
    return (
      <SkeletonBox
        data-text-skeleton-size={size}
        width="100%"
        className={clsx(className, classes.SkeletonText)}
        style={{
          ...style,
          maxWidth,
        }}
        {...rest}
        data-component="SkeletonText"
      />
    )
  }

  return (
    <div
      // update below to data-component="SkeletonText" in next major
      data-component="multilineContainer"
      className={classes.SkeletonTextWrapper}
      style={{
        ...style,
        maxWidth,
      }}
    >
      {Array.from({length: lines}, (_, index) => (
        <SkeletonBox
          key={index}
          data-in-multiline="true"
          data-text-skeleton-size={size}
          className={clsx(className, classes.SkeletonText)}
          {...rest}
        />
      ))}
    </div>
  )
}

export {SkeletonText}
export type {SkeletonTextProps}
