import {clsx} from 'clsx'
import type React from 'react'
import {type HTMLProps} from 'react'
import {SkeletonBox} from '../Skeleton'
import classes from './SkeletonText.module.css'
import {useLoadingVisibility} from '../loading'
import type {LoadingDelay} from '../loading'

interface SkeletonTextProps extends Omit<HTMLProps<HTMLElement>, 'size'>, LoadingDelay {
  /** Size of the text that the skeleton is replacing. */
  size?: 'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'subtitle'
  /** Number of lines of skeleton text to render. */
  lines?: number
  /** Maximum width that the line(s) of skeleton text can take up.  Accepts any valid CSS `max-width` value. */
  maxWidth?: React.CSSProperties['maxWidth']
  /** Class name for custom styling */
  className?: string
}

function SkeletonText({delay, lines = 1, maxWidth, size = 'bodyMedium', className, style, ...rest}: SkeletonTextProps) {
  const {style: loadingStyle} = useLoadingVisibility(delay)

  if (lines < 2) {
    return (
      <SkeletonBox
        data-component="SkeletonText"
        data-text-skeleton-size={size}
        width="100%"
        className={clsx(className, classes.SkeletonText)}
        style={{
          ...style,
          ...loadingStyle,
          maxWidth,
        }}
        {...rest}
      />
    )
  }

  return (
    <div
      data-component="multilineContainer"
      className={classes.SkeletonTextWrapper}
      style={{
        ...style,
        ...loadingStyle,
        maxWidth,
      }}
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

export {SkeletonText}
export type {SkeletonTextProps}
