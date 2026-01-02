import React from 'react'
import {type CSSProperties, type HTMLProps} from 'react'
import {clsx} from 'clsx'
import {useLoadingVisibility} from '../loading'
import type {LoadingDelay} from '../loading'
import classes from './SkeletonBox.module.css'

export type SkeletonBoxProps = {
  /** Height of the skeleton "box". Accepts any valid CSS `height` value. */
  height?: CSSProperties['height']
  /** Width of the skeleton "box". Accepts any valid CSS `width` value. */
  width?: CSSProperties['width']
  /** The className of the skeleton box */
  className?: string
} & LoadingDelay &
  HTMLProps<HTMLElement>

export const SkeletonBox = React.forwardRef<HTMLElement, SkeletonBoxProps>(function SkeletonBox(
  {delay, height, width, className, style, ...props},
  ref,
) {
  const {style: loadingStyle} = useLoadingVisibility(delay)
  const containerStyle = {
    height,
    width,
    ...loadingStyle,
    ...style,
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={clsx(className, classes.SkeletonBox)}
      style={containerStyle}
      {...props}
    />
  )
})
