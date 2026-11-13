import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import type {CSSPropertiesWithCustomProperties} from '../../utils/types'

const progressVariants = cva(
  'primer:flex primer:w-full primer:gap-0.5 primer:overflow-hidden primer:rounded-[var(--borderRadius-small)] primer:bg-[var(--progressBar-track-bgColor)] primer:[outline:solid_1px_var(--progressBar-track-borderColor)] primer:[outline-offset:-1px]',
  {
    variants: {
      size: {small: 'primer:h-[5px]', medium: 'primer:h-2', large: 'primer:h-2.5'},
      inline: {true: 'primer:inline-flex', false: ''},
    },
    defaultVariants: {size: 'medium', inline: false},
  },
)

const itemVariants = cva(
  'primer:h-full primer:w-[var(--progress-width)] primer:[background-color:var(--progress-bg)]',
  {
    variants: {
      variant: {
        accent: 'primer:[--progress-bg:var(--bgColor-accent-emphasis)]',
        success: 'primer:[--progress-bg:var(--bgColor-success-emphasis)]',
        attention: 'primer:[--progress-bg:var(--bgColor-attention-emphasis)]',
        danger: 'primer:[--progress-bg:var(--bgColor-danger-emphasis)]',
        severe: 'primer:[--progress-bg:var(--bgColor-severe-emphasis)]',
        done: 'primer:[--progress-bg:var(--bgColor-done-emphasis)]',
        sponsors: 'primer:[--progress-bg:var(--bgColor-sponsors-emphasis)]',
        neutral: 'primer:[--progress-bg:var(--bgColor-neutral-emphasis)]',
      },
      animated: {
        true: 'primer:motion-safe:animate-[primer-skeleton-shimmer_var(--base-duration-1000)_infinite] primer:motion-safe:[mask-image:linear-gradient(75deg,#000_30%,rgb(0_0_0/65%)_80%)] primer:motion-safe:[mask-size:200%]',
        false: '',
      },
    },
    defaultVariants: {variant: 'success', animated: false},
  },
)

export interface ProgressBarItemProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof itemVariants> {
  /** Custom fill color, such as a CSS color or `var(--my-progress-color)`. Overrides the variant color. */
  fillColor?: React.CSSProperties['backgroundColor']
  /** Percentage of the bar this segment fills, from 0 to 100. */
  progress?: number
}

export const ProgressBarItem = React.forwardRef<HTMLSpanElement, ProgressBarItemProps>(function ProgressBarItem(
  {
    'aria-valuemax': ariaValueMax = 100,
    'aria-valuemin': ariaValueMin = 0,
    'aria-valuenow': ariaValueNow,
    animated,
    className,
    fillColor,
    progress,
    style,
    variant,
    ...rest
  },
  ref,
) {
  const value = progress === undefined ? undefined : Math.min(100, Math.max(0, progress))
  const itemStyle: CSSPropertiesWithCustomProperties = {
    '--progress-width': `${value ?? 0}%`,
    ...(fillColor !== undefined && {'--progress-bg': fillColor}),
    ...style,
  }
  return (
    <span
      {...rest}
      ref={ref}
      role="progressbar"
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow ?? value}
      data-component="ProgressBar.Item"
      className={cn(itemVariants({animated, variant}), className)}
      style={itemStyle}
    />
  )
})

ProgressBarItem.displayName = 'ProgressBar.Item'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof progressVariants> {
  /** Percentage complete, from 0 to 100. */
  progress?: number
  /** Animates the bar to suggest indeterminate progress. */
  animated?: boolean
  /** Custom fill color for the single segment, such as a CSS color or `var(--my-progress-color)`. */
  fillColor?: React.CSSProperties['backgroundColor']
  /** Color of the single segment. */
  variant?: VariantProps<typeof itemVariants>['variant']
}

function hasRenderableChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(child =>
    React.isValidElement<{children?: React.ReactNode}>(child) && child.type === React.Fragment
      ? hasRenderableChildren(child.props.children)
      : true,
  )
}

const ProgressBarRoot = React.forwardRef<HTMLSpanElement, ProgressBarProps>(function ProgressBar(
  {
    'aria-valuemax': ariaValueMax,
    'aria-valuemin': ariaValueMin,
    'aria-valuenow': ariaValueNow,
    'aria-valuetext': ariaValueText,
    animated,
    children,
    className,
    fillColor,
    inline,
    progress,
    size,
    variant,
    ...rest
  },
  ref,
) {
  const hasChildren = hasRenderableChildren(children)
  if (hasChildren && progress !== undefined) {
    throw new Error('ProgressBar accepts either progress or children, not both.')
  }
  return (
    <span {...rest} ref={ref} data-component="ProgressBar" className={cn(progressVariants({inline, size}), className)}>
      {hasChildren ? (
        children
      ) : (
        <ProgressBarItem
          animated={animated}
          fillColor={fillColor}
          progress={progress ?? 0}
          variant={variant}
          aria-label={rest['aria-label']}
          aria-labelledby={rest['aria-labelledby']}
          aria-describedby={rest['aria-describedby']}
          aria-valuemax={ariaValueMax}
          aria-valuemin={ariaValueMin}
          aria-valuenow={ariaValueNow}
          aria-valuetext={ariaValueText}
        />
      )}
    </span>
  )
})

ProgressBarRoot.displayName = 'ProgressBar'

export const ProgressBar = Object.assign(ProgressBarRoot, {Item: ProgressBarItem})
