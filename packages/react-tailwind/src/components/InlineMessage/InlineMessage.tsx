import {AlertFillIcon, AlertIcon, CheckCircleFillIcon, CheckCircleIcon, InfoIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

export type InlineMessageVariant = 'critical' | 'success' | 'unavailable' | 'warning'
const message = cva(
  'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2 text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)]',
  {
    variants: {
      size: {
        small:
          '[--inline-message-font-size:var(--text-body-size-small)] [--inline-message-line-height:var(--text-body-lineHeight-small)]',
        medium:
          '[--inline-message-font-size:var(--text-body-size-medium)] [--inline-message-line-height:var(--text-body-lineHeight-medium)]',
      },
      variant: {
        critical: 'text-danger',
        success: 'text-success',
        unavailable: 'text-muted',
        warning: 'text-attention',
        undefined: 'text-default',
      },
    },
    defaultVariants: {size: 'medium'},
  },
)
const icons: Record<InlineMessageVariant, [React.ElementType, React.ElementType]> = {
  critical: [AlertIcon, AlertFillIcon],
  success: [CheckCircleIcon, CheckCircleFillIcon],
  unavailable: [AlertIcon, AlertFillIcon],
  warning: [AlertIcon, AlertFillIcon],
}
export interface InlineMessageProps extends React.ComponentPropsWithoutRef<'div'> {
  size?: 'small' | 'medium'
  variant?: InlineMessageVariant
  leadingVisual?: React.ElementType | React.ReactNode
}
export const InlineMessage = React.forwardRef<HTMLDivElement, InlineMessageProps>(function InlineMessage(
  {children, className, leadingVisual, size = 'medium', variant, ...rest},
  ref,
) {
  const DefaultIcon = variant ? icons[variant][size === 'small' ? 1 : 0] : InfoIcon
  const visual =
    leadingVisual === undefined ? (
      <DefaultIcon
        className="min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]"
        size={size === 'small' ? 12 : 16}
      />
    ) : typeof leadingVisual === 'function' ? (
      React.createElement(leadingVisual, {
        className: 'min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]',
      })
    ) : (
      leadingVisual
    )
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(message({size, variant}), className)}
      data-component="InlineMessage"
      data-size={size}
      data-variant={variant}
    >
      {visual}
      {children}
    </div>
  )
})
