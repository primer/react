import type React from 'react'
import {type HTMLProps} from 'react'
import classes from './SkeletonText.module.css'
import {clsx} from 'clsx'
import skeletonClasses from '../Skeleton/skeleton.module.css'

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

function SkeletonText({
  lines = 1,
  maxWidth,
  size = 'bodyMedium',
  className,
  style,
  height,
  width,
  ref,
  ...rest
}: SkeletonTextProps) {
  if (lines < 2) {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-text-skeleton-size={size}
        className={clsx(className, classes.SkeletonText, skeletonClasses.skeleton)}
        style={{
          height,
          width: width ?? '100%',
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
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          key={index}
          data-component="SkeletonText"
          data-in-multiline="true"
          data-text-skeleton-size={size}
          className={clsx(className, classes.SkeletonText, skeletonClasses.skeleton)}
          style={{
            height,
            width,
          }}
          {...rest}
        />
      ))}
    </div>
  )
}

export {SkeletonText}
export type {SkeletonTextProps}
