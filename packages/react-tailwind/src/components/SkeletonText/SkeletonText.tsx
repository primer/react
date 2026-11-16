import React from 'react'
import {cn} from '../../internal/cn'
import {SkeletonBox} from '../SkeletonBox'

const sizeClasses = {
  display: 'primer:[--font-size:var(--text-display-size)] primer:[--line-height:var(--text-display-lineHeight)]',
  titleLarge:
    'primer:[--font-size:var(--text-title-size-large)] primer:[--line-height:var(--text-title-lineHeight-large)]',
  titleMedium:
    'primer:[--font-size:var(--text-title-size-medium)] primer:[--line-height:var(--text-title-lineHeight-medium)]',
  titleSmall:
    'primer:[--font-size:var(--text-title-size-small)] primer:[--line-height:var(--text-title-lineHeight-small)]',
  bodyLarge:
    'primer:[--font-size:var(--text-body-size-large)] primer:[--line-height:var(--text-body-lineHeight-large)]',
  bodyMedium:
    'primer:[--font-size:var(--text-body-size-medium)] primer:[--line-height:var(--text-body-lineHeight-medium)]',
  bodySmall:
    'primer:[--font-size:var(--text-body-size-small)] primer:[--line-height:var(--text-body-lineHeight-small)]',
  subtitle: 'primer:[--font-size:var(--text-subtitle-size)] primer:[--line-height:var(--text-subtitle-lineHeight)]',
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Number of placeholder lines to render. */
  lines?: number
  /** Largest width the placeholder lines may reach. */
  maxWidth?: React.CSSProperties['maxWidth']
  /** Typography size whose font height and line spacing the placeholder matches. */
  size?: keyof typeof sizeClasses
}

export const SkeletonText = React.forwardRef<HTMLElement, SkeletonTextProps>(function SkeletonText(
  {className, lines = 1, maxWidth, size = 'bodyMedium', style, ...rest},
  ref,
) {
  const count = Math.max(1, Math.floor(lines))
  if (count === 1) {
    return (
      <SkeletonBox
        {...rest}
        ref={ref}
        data-component="SkeletonText"
        data-text-skeleton-size={size}
        width="100%"
        className={cn(
          'primer:[--leading:calc(var(--font-size)*var(--line-height)-var(--font-size))] primer:h-[var(--font-size)] primer:rounded-[var(--borderRadius-small)] primer:[margin-block:calc(var(--leading)/2)]',
          sizeClasses[size],
          className,
        )}
        style={{...style, maxWidth}}
      />
    )
  }
  return (
    <div
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      role={rest.role ?? (rest['aria-label'] || rest['aria-labelledby'] ? 'img' : undefined)}
      data-component="SkeletonText"
      data-text-skeleton-size={size}
      className={cn('primer:w-full primer:py-[0.1px]', className)}
      style={{...style, maxWidth}}
    >
      {Array.from({length: count}, (_, index) => (
        <SkeletonBox
          key={index}
          aria-hidden="true"
          data-component="SkeletonText.Line"
          data-in-multiline="true"
          data-text-skeleton-size={size}
          className={cn(
            'primer:[--leading:calc(var(--font-size)*var(--line-height)-var(--font-size))] primer:h-[var(--font-size)] primer:w-full primer:rounded-[var(--borderRadius-small)] primer:[margin-block:calc(var(--leading)/2)] primer:[margin-block-end:calc(var(--leading)*2)]',
            sizeClasses[size],
            index === count - 1 && 'primer:max-w-[65%] primer:min-w-[50px] primer:[margin-block-end:0]',
          )}
        />
      ))}
    </div>
  )
})

SkeletonText.displayName = 'SkeletonText'
