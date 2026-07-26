import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const progressVariants = cva(
  'flex w-full gap-0.5 overflow-hidden rounded-[var(--borderRadius-small)] bg-[var(--progressBar-track-bgColor)] [outline:solid_1px_var(--progressBar-track-borderColor)] [outline-offset:-1px]',
  {
    variants: {size: {small: 'h-[5px]', medium: 'h-2', large: 'h-2.5'}, inline: {true: 'inline-flex', false: ''}},
    defaultVariants: {size: 'medium', inline: false},
  },
)

const itemVariants = cva('h-full w-[var(--progress-width)] [background-color:var(--progress-bg)]', {
  variants: {
    variant: {
      accent: '[--progress-bg:var(--bgColor-accent-emphasis)]',
      success: '[--progress-bg:var(--bgColor-success-emphasis)]',
      attention: '[--progress-bg:var(--bgColor-attention-emphasis)]',
      danger: '[--progress-bg:var(--bgColor-danger-emphasis)]',
      severe: '[--progress-bg:var(--bgColor-severe-emphasis)]',
      done: '[--progress-bg:var(--bgColor-done-emphasis)]',
      sponsors: '[--progress-bg:var(--bgColor-sponsors-emphasis)]',
      neutral: '[--progress-bg:var(--bgColor-neutral-emphasis)]',
    },
    animated: {
      true: 'motion-safe:animate-[primer-skeleton-shimmer_var(--base-duration-1000)_infinite] motion-safe:[mask-image:linear-gradient(75deg,#000_30%,rgb(0_0_0/65%)_80%)] motion-safe:[mask-size:200%]',
      false: '',
    },
  },
  defaultVariants: {variant: 'success', animated: false},
})

export interface ProgressBarItemProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof itemVariants> {
  progress?: number
}

export const ProgressBarItem = React.forwardRef<HTMLSpanElement, ProgressBarItemProps>(function ProgressBarItem(
  {animated, className, progress, style, variant, ...rest},
  ref,
) {
  const value = progress === undefined ? undefined : Math.min(100, Math.max(0, progress))
  return (
    <span
      {...rest}
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      data-component="ProgressBar.Item"
      className={cn(itemVariants({animated, variant}), className)}
      style={{'--progress-width': `${value ?? 0}%`, ...style} as React.CSSProperties}
    />
  )
})

ProgressBarItem.displayName = 'ProgressBar.Item'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof progressVariants> {
  progress?: number
  animated?: boolean
  variant?: VariantProps<typeof itemVariants>['variant']
}

const ProgressBarRoot = React.forwardRef<HTMLSpanElement, ProgressBarProps>(function ProgressBar(
  {animated, children, className, inline, progress, size, variant, ...rest},
  ref,
) {
  if (children && progress !== undefined) {
    throw new Error('ProgressBar accepts either progress or children, not both.')
  }
  return (
    <span {...rest} ref={ref} data-component="ProgressBar" className={cn(progressVariants({inline, size}), className)}>
      {children ?? (
        <ProgressBarItem animated={animated} progress={progress} variant={variant} aria-label={rest['aria-label']} />
      )}
    </span>
  )
})

ProgressBarRoot.displayName = 'ProgressBar'

export const ProgressBar = Object.assign(ProgressBarRoot, {Item: ProgressBarItem})
