import React from 'react'
import {cn} from '../../internal/cn'
import {SkeletonBox} from '../SkeletonBox'

const sizeClasses = {
  display: 'h-8',
  titleLarge: 'h-7',
  titleMedium: 'h-6',
  titleSmall: 'h-5',
  bodyLarge: 'h-5',
  bodyMedium: 'h-4',
  bodySmall: 'h-3',
  subtitle: 'h-5',
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLElement> {
  lines?: number
  maxWidth?: React.CSSProperties['maxWidth']
  size?: keyof typeof sizeClasses
}

export const SkeletonText = React.forwardRef<HTMLElement, SkeletonTextProps>(function SkeletonText(
  {className, lines = 1, maxWidth, size = 'bodyMedium', style, ...rest},
  ref,
) {
  const count = Math.max(1, Math.floor(lines))
  if (count === 1) {
    return (
      <div
        {...rest}
        ref={ref as React.Ref<HTMLDivElement>}
        data-component="SkeletonText"
        aria-busy="true"
        className={cn(
          'w-full animate-pulse rounded-md bg-neutral-muted motion-reduce:animate-none',
          sizeClasses[size],
          className,
        )}
        style={{maxWidth, ...style}}
      />
    )
  }
  return (
    <div
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      data-component="SkeletonText"
      aria-busy="true"
      className={cn('flex w-full flex-col gap-2', className)}
      style={{maxWidth, ...style}}
    >
      {Array.from({length: count}, (_, index) => (
        <SkeletonBox
          key={index}
          aria-hidden="true"
          className={cn('w-full', sizeClasses[size], index === count - 1 && 'w-2/3')}
        />
      ))}
    </div>
  )
})

SkeletonText.displayName = 'SkeletonText'
