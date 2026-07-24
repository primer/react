import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon, XIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

export type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning'

const banner = cva('grid grid-cols-[auto_minmax(0,1fr)_auto] items-start border-thin rounded-md p-2 text-default', {
  variants: {
    variant: {
      critical: 'border-danger-muted bg-danger-muted',
      info: 'border-accent-muted bg-accent-muted',
      success: 'border-success-muted bg-success-muted',
      upsell: 'border-upsell-muted bg-upsell-muted',
      warning: 'border-attention-muted bg-attention-muted',
    },
    layout: {default: '', compact: 'p-1'},
    flush: {true: 'rounded-none border-x-0', false: ''},
  },
  defaultVariants: {variant: 'info', layout: 'default', flush: false},
})

const iconForVariant: Record<BannerVariant, React.ElementType> = {
  critical: StopIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  upsell: InfoIcon,
  warning: AlertIcon,
}

export interface BannerProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  leadingVisual?: React.ReactNode
  onDismiss?: () => void
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
  variant?: BannerVariant
  layout?: 'default' | 'compact'
  actionsLayout?: 'inline' | 'stacked' | 'default'
  flush?: boolean
  hideTitle?: boolean
}

const BannerContext = React.createContext<string | undefined>(undefined)
const BannerActionsLayoutContext = React.createContext<NonNullable<BannerProps['actionsLayout']>>('default')

export const Banner = React.forwardRef<HTMLElement, BannerProps>(function Banner(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    actionsLayout = 'default',
    children,
    className,
    description,
    flush = false,
    hideTitle = false,
    layout = 'default',
    leadingVisual,
    onDismiss,
    primaryAction,
    secondaryAction,
    title,
    variant = 'info',
    ...rest
  },
  ref,
) {
  const titleId = React.useId()
  const DefaultIcon = iconForVariant[variant]
  const visual = variant === 'info' || variant === 'upsell' ? (leadingVisual ?? <DefaultIcon />) : <DefaultIcon />

  return (
    <BannerContext.Provider value={titleId}>
      <BannerActionsLayoutContext.Provider value={actionsLayout}>
        <section
          {...rest}
          ref={ref}
          aria-label={ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (ariaLabel || !title ? undefined : titleId)}
          className={cn(banner({variant, layout, flush}), className)}
          data-actions-layout={actionsLayout}
          data-component="Banner"
          data-dismissible={onDismiss ? '' : undefined}
          data-flush={flush ? '' : undefined}
          data-layout={layout}
          data-title-hidden={hideTitle ? '' : undefined}
          data-variant={variant}
          tabIndex={-1}
        >
          <span
            aria-hidden="true"
            className={cn('grid place-items-center p-1', iconColor[variant])}
            data-component="Banner.Icon"
          >
            {visual}
          </span>
          <div className="flex min-w-0 flex-wrap items-start justify-between gap-1">
            <div className="my-1 grid min-w-0 gap-1">
              {title ? (
                hideTitle ? (
                  <span className="sr-only">
                    <BannerTitle>{title}</BannerTitle>
                  </span>
                ) : (
                  <BannerTitle>{title}</BannerTitle>
                )
              ) : null}
              {description ? <BannerDescription>{description}</BannerDescription> : null}
              {children}
            </div>
            {primaryAction || secondaryAction ? (
              <BannerActions primaryAction={primaryAction} secondaryAction={secondaryAction} />
            ) : null}
          </div>
          {onDismiss ? (
            <button
              aria-label="Dismiss banner"
              className={cn('ml-1 grid size-8 place-items-center rounded-md', iconColor[variant])}
              onClick={onDismiss}
              type="button"
            >
              <XIcon />
            </button>
          ) : null}
        </section>
      </BannerActionsLayoutContext.Provider>
    </BannerContext.Provider>
  )
})

const iconColor: Record<BannerVariant, string> = {
  critical: 'text-danger',
  info: 'text-accent',
  success: 'text-success',
  upsell: 'text-upsell',
  warning: 'text-attention',
}

export interface BannerTitleProps extends React.ComponentPropsWithoutRef<'h2'> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function BannerTitle({as: Heading = 'h2', className, id, ...rest}: BannerTitleProps) {
  const titleId = React.useContext(BannerContext)
  return (
    <Heading
      {...rest}
      className={cn('m-0 text-base font-semibold', className)}
      data-banner-title=""
      data-component="Banner.Title"
      id={id ?? titleId}
    />
  )
}

export function BannerDescription({className, ...rest}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...rest} className={cn('text-base', className)} data-component="Banner.Description" />
}

export interface BannerActionsProps {
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function BannerActions({primaryAction, secondaryAction}: BannerActionsProps) {
  const layout = React.useContext(BannerActionsLayoutContext)
  return (
    <div
      className={cn(
        'my-1 flex gap-3',
        layout === 'stacked' ? 'flex-col items-stretch' : 'items-center',
        layout === 'default' && 'max-sm:flex-col max-sm:items-stretch',
      )}
      data-component="Banner.Actions"
      data-layout={layout}
    >
      {secondaryAction}
      {primaryAction}
    </div>
  )
}
