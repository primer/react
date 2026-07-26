'use client'

import React from 'react'
import {cn} from '../../internal/cn'

export interface SkeletonBoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  'data-component'?: string
  height?: React.CSSProperties['height']
  width?: React.CSSProperties['width']
  delay?: 'short' | 'long' | number
}

export const SkeletonBox = React.forwardRef<HTMLElement, SkeletonBoxProps>(function SkeletonBox(
  {as: Component = 'div', className, delay, height, style, width, 'data-component': dataComponent, ...rest},
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
      data-component={dataComponent ?? 'SkeletonBox'}
      aria-busy="true"
      className={cn(
        'block h-4 w-full rounded-[var(--borderRadius-small)] bg-[var(--skeletonLoader-bgColor)] motion-safe:animate-[primer-skeleton-shimmer_var(--base-duration-1000)_infinite] motion-safe:[mask-image:linear-gradient(75deg,#000_30%,rgb(0_0_0/65%)_80%)] motion-safe:[mask-size:200%]',
        className,
      )}
      style={{height, width, ...style}}
    />
  )
})

SkeletonBox.displayName = 'SkeletonBox'
