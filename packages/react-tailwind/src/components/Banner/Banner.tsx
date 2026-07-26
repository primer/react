'use client'

import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon, XIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {Button, ButtonBase, type ButtonProps} from '../Button'

export type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning'

const banner = cva('grid grid-cols-[auto_minmax(0,1fr)_auto] items-start border rounded-md p-2 text-default', {
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
const BannerActionsLayoutContext = React.createContext<{
  layout: NonNullable<BannerProps['actionsLayout']>
  placeActionsBelowContent: boolean
}>({layout: 'default', placeActionsBelowContent: false})

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
  const hasActions = Boolean(primaryAction || secondaryAction)

  return (
    <BannerContext.Provider value={titleId}>
      <BannerActionsLayoutContext.Provider
        value={{
          layout: actionsLayout,
          placeActionsBelowContent: Boolean(onDismiss && !hideTitle && actionsLayout !== 'inline'),
        }}
      >
        <section
          {...rest}
          ref={ref}
          aria-label={ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (ariaLabel || !title ? undefined : titleId)}
          className={cn('@container/banner', banner({variant, layout, flush}), className)}
          data-actions-layout={actionsLayout}
          data-component="Banner"
          data-dismissible={onDismiss ? '' : undefined}
          data-flush={flush ? '' : undefined}
          data-has-actions={hasActions ? '' : undefined}
          data-layout={layout}
          data-title-hidden={hideTitle ? '' : undefined}
          data-variant={variant}
          tabIndex={-1}
        >
          <span
            aria-hidden="true"
            className={cn(
              'grid place-items-center p-2 [&>svg]:h-5',
              hideTitle && !primaryAction && !secondaryAction && '[&>svg]:h-4',
              iconColor[variant],
            )}
            data-component="Banner.Icon"
          >
            {visual}
          </span>
          <div
            className={cn(
              'min-w-0 items-start gap-1 text-sm leading-normal',
              onDismiss && !hideTitle && actionsLayout !== 'inline'
                ? 'grid'
                : actionsLayout === 'stacked'
                  ? 'flex flex-col'
                  : actionsLayout === 'inline'
                    ? 'flex flex-nowrap justify-between max-[767px]:grid max-[767px]:grid-rows-[auto_auto]'
                    : cn(
                        'flex flex-wrap justify-between @max-[500px]/banner:grid @min-[500px]/banner:grid @min-[500px]/banner:grid-cols-[auto_auto]',
                        hasActions && '@max-[500px]/banner:grid-rows-[auto_auto]',
                      ),
            )}
          >
            <div
              className={cn('my-2 grid min-w-0 gap-1', hideTitle && !hasActions && 'my-1.5')}
              data-component="Banner.Content"
            >
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
            {hasActions ? <BannerActions primaryAction={primaryAction} secondaryAction={secondaryAction} /> : null}
          </div>
          {onDismiss ? (
            <ButtonBase
              aria-label="Dismiss banner"
              className={cn(
                'ml-1 grid size-8 place-items-center border-0 bg-transparent p-2',
                hasActions && 'my-0.5',
                iconColor[variant],
              )}
              onClick={onDismiss}
              type="button"
            >
              <XIcon />
            </ButtonBase>
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
      className={cn('m-0 text-sm font-semibold', className)}
      data-banner-title=""
      data-component="Banner.Title"
      id={id ?? titleId}
    />
  )
}

export function BannerDescription({className, ...rest}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...rest} className={className} data-component="Banner.Description" />
}

export interface BannerActionsProps {
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function BannerActions({primaryAction, secondaryAction}: BannerActionsProps) {
  const {layout, placeActionsBelowContent} = React.useContext(BannerActionsLayoutContext)
  return (
    <div
      className={cn(
        'shrink-0',
        placeActionsBelowContent && 'mb-1.5',
        layout === 'default' && '@max-[500px]/banner:mb-1.5',
      )}
      data-component="Banner.Actions"
      data-layout={layout}
    >
      <div
        className={cn(
          'flex items-center gap-3 py-0.5',
          layout === 'inline' && 'flex-row-reverse max-[767px]:flex-row',
          layout === 'default' && !placeActionsBelowContent && '@min-[500px]/banner:flex-row-reverse',
        )}
      >
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  )
}

export type BannerPrimaryActionProps = Omit<ButtonProps, 'variant'>

export const BannerPrimaryAction = React.forwardRef<HTMLElement, BannerPrimaryActionProps>(
  function BannerPrimaryAction(props, ref) {
    return <Button {...props} ref={ref} variant="default" data-component="Banner.PrimaryAction" />
  },
)

export type BannerSecondaryActionProps = Omit<ButtonProps, 'variant'>

export const BannerSecondaryAction = React.forwardRef<HTMLElement, BannerSecondaryActionProps>(
  function BannerSecondaryAction(props, ref) {
    return <Button {...props} ref={ref} variant="invisible" data-component="Banner.SecondaryAction" />
  },
)
;('use client')
