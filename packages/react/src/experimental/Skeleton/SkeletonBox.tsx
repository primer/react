import React from 'react'
import {merge, type SxProp} from '../../sx'
import {type CSSProperties} from 'react'
import {clsx} from 'clsx'
import classes from './SkeletonBox.module.css'
import {defaultSxProp} from '../../utils/defaultSxProp'
import Box from '../../Box'

type SkeletonBoxProps = {
  /** Height of the skeleton "box". Accepts any valid CSS `height` value. */
  height?: CSSProperties['height']
  /** Width of the skeleton "box". Accepts any valid CSS `width` value. */
  width?: CSSProperties['width']
  /** The className of the skeleton box */
  className?: string
} & SxProp &
  React.ComponentPropsWithoutRef<'div'>

export const SkeletonBox = React.forwardRef<HTMLDivElement, SkeletonBoxProps>(function SkeletonBox(
  {height, width, className, style, sx: sxProp = defaultSxProp, ...props},
  ref,
) {
  if (sxProp !== defaultSxProp) {
    return (
      <Box
        as="div"
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
        sx={sxProp}
      />
    )
  }
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
