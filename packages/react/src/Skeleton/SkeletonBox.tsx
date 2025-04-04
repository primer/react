import React from 'react'
import {type CSSProperties, type HTMLProps} from 'react'
import {clsx} from 'clsx'
import classes from './SkeletonBox.module.css'
import {merge} from '../sx'

export type SkeletonBoxProps = {
  /** Height of the skeleton "box". Accepts any valid CSS `height` value. */
  height?: CSSProperties['height']
  /** Width of the skeleton "box". Accepts any valid CSS `width` value. */
  width?: CSSProperties['width']
  /** The className of the skeleton box */
  className?: string
} & HTMLProps<HTMLDivElement>

export const SkeletonBox = React.forwardRef<HTMLDivElement, SkeletonBoxProps>(function SkeletonBox(
  {height, width, className, style, ...props},
  ref,
) {
  return (
    <div
      className={clsx(className, classes.SkeletonBox)}
      style={merge(
        style as CSSProperties,
        {
          height,
          width,
        } as CSSProperties,
      )}
      {...props}
      ref={ref}
    />
  )
})
