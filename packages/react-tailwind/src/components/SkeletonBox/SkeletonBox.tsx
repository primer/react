'use client'

import React from 'react'
import {cn} from '../../internal/cn'

export interface SkeletonBoxProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. */
  as?: React.ElementType
  /** Overrides the marker used to identify this element in tests and styling. */
  'data-component'?: string
  /** Height of the placeholder. */
  height?: React.CSSProperties['height']
  /** Width of the placeholder. */
  width?: React.CSSProperties['width']
  /** Waits before showing the placeholder, so a fast response never flashes one. Accepts a named delay or milliseconds. */
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
      role={rest.role ?? (rest['aria-label'] || rest['aria-labelledby'] ? 'img' : undefined)}
      data-component={dataComponent ?? 'SkeletonBox'}
      className={cn(
        'primer:block primer:h-4 primer:w-full primer:rounded-[var(--borderRadius-small)] primer:bg-[var(--skeletonLoader-bgColor)] primer:motion-safe:animate-[primer-skeleton-shimmer_var(--base-duration-1000)_infinite] primer:motion-safe:[mask-image:linear-gradient(75deg,#000_30%,rgb(0_0_0/65%)_80%)] primer:motion-safe:[mask-size:200%]',
        className,
      )}
      style={{height, width, ...style}}
    />
  )
})

SkeletonBox.displayName = 'SkeletonBox'
