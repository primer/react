import {AlertFillIcon, AlertIcon, CheckCircleFillIcon, CheckCircleIcon, InfoIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {renderIcon} from '../../internal/icon'

export type InlineMessageVariant = 'critical' | 'success' | 'unavailable' | 'warning'
const message = cva(
  'primer:grid primer:grid-cols-[auto_minmax(0,1fr)] primer:items-start primer:gap-2 primer:text-[length:var(--inline-message-font-size)] primer:leading-[var(--inline-message-line-height)]',
  {
    variants: {
      size: {
        small:
          'primer:[--inline-message-font-size:var(--text-body-size-small)] primer:[--inline-message-line-height:var(--text-body-lineHeight-small)]',
        medium:
          'primer:[--inline-message-font-size:var(--text-body-size-medium)] primer:[--inline-message-line-height:var(--text-body-lineHeight-medium)]',
      },
      variant: {
        critical: 'primer:text-danger',
        success: 'primer:text-success',
        unavailable: 'primer:text-muted',
        warning: 'primer:text-attention',
        undefined: 'primer:text-default',
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
  /** Text size of the message. */
  size?: 'small' | 'medium'
  /** Severity of the message, which sets its colour and default icon. */
  variant?: InlineMessageVariant
  /** Replaces the icon the variant would otherwise choose. */
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
        className="primer:min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]"
        size={size === 'small' ? 12 : 16}
      />
    ) : (
      renderIcon(
        leadingVisual,
        'primer:min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]',
      )
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
