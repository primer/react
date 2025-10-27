/* eslint-disable primer-react/spread-props-first */
import React from 'react'
import {type CSSProperties, type HTMLProps} from 'react'
import {clsx} from 'clsx'
import classes from './SkeletonBox.module.css'

export type SkeletonBoxProps = {
  /** Height of the skeleton "box". Accepts any valid CSS `height` value. */
  height?: CSSProperties['height']
  /** Width of the skeleton "box". Accepts any valid CSS `width` value. */
  width?: CSSProperties['width']
  /** The className of the skeleton box */
  className?: string
} & HTMLProps<HTMLElement>

export const SkeletonBox = React.forwardRef<HTMLElement, SkeletonBoxProps>(function SkeletonBox(
  {height, width, className, style, ...props},
  ref,
) {
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={clsx(className, classes.SkeletonBox)}
      style={{height, width, ...(style || {})}}
      {...props}
    />
  )
})
