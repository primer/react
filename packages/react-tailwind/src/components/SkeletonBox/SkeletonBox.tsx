'use client'

import React from 'react'
import {cn} from '../../internal/cn'

export interface SkeletonBoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  height?: React.CSSProperties['height']
  width?: React.CSSProperties['width']
  delay?: 'short' | 'long' | number
}

export const SkeletonBox = React.forwardRef<HTMLElement, SkeletonBoxProps>(function SkeletonBox(
  {as: Component = 'div', className, delay, height, style, width, ...rest},
  ref,
) {
  const [visible, setVisible] = React.useState(!delay)
  React.useEffect(() => {
    if (!delay) return
    const timeout = window.setTimeout(
      () => setVisible(true),
      typeof delay === 'number' ? delay : delay === 'short' ? 300 : 1000,
    )
    return () => window.clearTimeout(timeout)
  }, [delay])
  if (!visible) return null
  return (
    <Component
      {...rest}
      ref={ref}
      data-component="SkeletonBox"
      aria-busy="true"
      className={cn('animate-pulse rounded-md bg-neutral-muted motion-reduce:animate-none', className)}
      style={{height, width, ...style}}
    />
  )
})

SkeletonBox.displayName = 'SkeletonBox'
