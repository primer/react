import React, {useEffect, useState} from 'react'
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
  /** Controls whether and how long to delay rendering the SkeletonBox. Set to 'short' to delay by 300ms, 'long' to delay by 1000ms, or provide a custom number of milliseconds.*/
  delay?: 'short' | 'long' | number
} & HTMLProps<HTMLElement>

export const SkeletonBox = React.forwardRef<HTMLElement, SkeletonBoxProps>(function SkeletonBox(
  {height, width, className, style, delay = false, ...props},
  ref,
) {
  const [isVisible, setIsVisible] = useState(!delay)

  useEffect(() => {
    if (delay) {
      const timeoutId = setTimeout(
        () => {
          setIsVisible(true)
        },
        typeof delay === 'number' ? delay : delay === 'short' ? 300 : 1000,
      )

      return () => clearTimeout(timeoutId)
    }
  }, [delay])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={clsx(className, classes.SkeletonBox)}
      style={{height, width, ...(style || {})}}
      {...props}
    />
  )
})
