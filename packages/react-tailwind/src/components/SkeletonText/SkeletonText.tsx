import React from 'react'
import {cn} from '../../internal/cn'
import {SkeletonBox} from '../SkeletonBox'

const sizeClasses = {
  display: '[--font-size:var(--text-display-size)] [--line-height:var(--text-display-lineHeight)]',
  titleLarge: '[--font-size:var(--text-title-size-large)] [--line-height:var(--text-title-lineHeight-large)]',
  titleMedium: '[--font-size:var(--text-title-size-medium)] [--line-height:var(--text-title-lineHeight-medium)]',
  titleSmall: '[--font-size:var(--text-title-size-small)] [--line-height:var(--text-title-lineHeight-small)]',
  bodyLarge: '[--font-size:var(--text-body-size-large)] [--line-height:var(--text-body-lineHeight-large)]',
  bodyMedium: '[--font-size:var(--text-body-size-medium)] [--line-height:var(--text-body-lineHeight-medium)]',
  bodySmall: '[--font-size:var(--text-body-size-small)] [--line-height:var(--text-body-lineHeight-small)]',
  subtitle: '[--font-size:var(--text-subtitle-size)] [--line-height:var(--text-subtitle-lineHeight)]',
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Number of placeholder lines to render. */
  lines?: number
  /** Largest width the placeholder lines may reach. */
  maxWidth?: React.CSSProperties['maxWidth']
  /** Line height, matching the text size it stands in for. */
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
          '[--leading:calc(var(--font-size)*var(--line-height)-var(--font-size))] h-4 rounded-[var(--borderRadius-small)] [margin-block:calc(var(--leading)/2)]',
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
      aria-busy="true"
      data-component="SkeletonText"
      data-text-skeleton-size={size}
      className={cn('w-full py-[0.1px]', className)}
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
            '[--leading:calc(var(--font-size)*var(--line-height)-var(--font-size))] h-4 w-full rounded-[var(--borderRadius-small)] [margin-block:calc(var(--leading)/2)] [margin-block-end:calc(var(--leading)*2)]',
            sizeClasses[size],
            index === count - 1 && 'max-w-[65%] min-w-[50px] [margin-block-end:0]',
          )}
        />
      ))}
    </div>
  )
})

SkeletonText.displayName = 'SkeletonText'
