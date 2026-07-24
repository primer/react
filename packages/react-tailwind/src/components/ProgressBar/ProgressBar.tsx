import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const progressVariants = cva('flex w-full gap-0.5 overflow-hidden rounded-sm bg-[var(--borderColor-default)]', {
  variants: {size: {small: 'h-[5px]', default: 'h-2', large: 'h-2.5'}, inline: {true: 'inline-flex', false: ''}},
  defaultVariants: {size: 'default', inline: false},
})

const itemVariants = cva('h-full rounded-full motion-reduce:transition-none', {
  variants: {
    variant: {
      accent: 'bg-accent-emphasis',
      success: 'bg-success-emphasis',
      attention: 'bg-attention-emphasis',
      danger: 'bg-danger-emphasis',
    },
    animated: {true: 'transition-[width] duration-300 ease-in-out', false: ''},
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
      style={{width: `${value ?? 0}%`, ...style}}
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
