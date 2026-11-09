'use client'

import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon, XIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {flattenChildren} from '../../internal/children'
import {cn} from '../../internal/cn'
import {Button, type ButtonProps} from '../Button'
import {IconButton} from '../IconButton'
import {LinkButtonBase, type LinkButtonProps} from '../LinkButton/LinkButton'

export type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning'

const banner = cva(
  'primer:grid primer:grid-cols-[auto_minmax(0,1fr)_auto] primer:items-start primer:border-thin primer:rounded-md primer:p-2 primer:text-default',
  {
    variants: {
      variant: {
        critical: 'primer:border-danger-muted primer:bg-danger-muted',
        info: 'primer:border-accent-muted primer:bg-accent-muted',
        success: 'primer:border-success-muted primer:bg-success-muted',
        upsell: 'primer:border-upsell-muted primer:bg-upsell-muted',
        warning: 'primer:border-attention-muted primer:bg-attention-muted',
      },
      layout: {default: '', compact: 'primer:p-1'},
      flush: {true: 'primer:rounded-none primer:border-x-0', false: ''},
    },
    defaultVariants: {variant: 'info', layout: 'default', flush: false},
  },
)

const iconForVariant: Record<BannerVariant, React.ElementType> = {
  critical: StopIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  upsell: InfoIcon,
  warning: AlertIcon,
}

export interface BannerProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> {
  /** Short summary of the banner's message. */
  title?: React.ReactNode
  /** Supporting detail shown below the title. */
  description?: React.ReactNode
  /** Replaces the icon the variant would otherwise choose. */
  leadingVisual?: React.ReactNode
  /** Shows a dismiss button and is called when it is pressed. */
  onDismiss?: () => void
  /** Most important action, rendered first. */
  primaryAction?: React.ReactNode
  /** Supporting action, rendered after the primary one. */
  secondaryAction?: React.ReactNode
  /** Severity of the message, which also sets the colour and default icon. */
  variant?: BannerVariant
  /** Use `compact` to reduce the banner's spacing. */
  layout?: 'default' | 'compact'
  /** Whether actions sit inline with the message or stack below it. */
  actionsLayout?: 'inline' | 'stacked' | 'default'
  /** Removes the outer border and radius so the banner can span a container edge to edge. */
  flush?: boolean
  /** Hides the title visually while keeping it available to assistive technology. */
  hideTitle?: boolean
}

const BannerContext = React.createContext<string | undefined>(undefined)
const BannerActionsLayoutContext = React.createContext<{
  layout: NonNullable<BannerProps['actionsLayout']>
  placeActionsBelowContent: boolean
}>({layout: 'default', placeActionsBelowContent: false})

function addComposedTitleId(children: React.ReactNode, id: string | undefined): React.ReactNode {
  let assigned = false
  function visit(nodes: React.ReactNode): React.ReactNode {
    return React.Children.map(nodes, child => {
      if (!React.isValidElement<{children?: React.ReactNode; id?: string}>(child)) return child
      if (child.type === React.Fragment) return React.cloneElement(child, {children: visit(child.props.children)})
      if (id && !assigned && child.type === BannerTitle) {
        assigned = true
        return React.cloneElement(child, {id})
      }
      return child
    })
  }
  return visit(children)
}

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
  const composedTitle = flattenChildren(children).find(
    (child): child is React.ReactElement<BannerTitleProps> =>
      React.isValidElement<BannerTitleProps>(child) && child.type === BannerTitle,
  )
  const composedTitleId = composedTitle ? (composedTitle.props.id ?? `${titleId}-composed`) : undefined
  const renderedChildren = addComposedTitleId(children, composedTitle?.props.id ? undefined : composedTitleId)
  const DefaultIcon = iconForVariant[variant]
  const visual = variant === 'info' || variant === 'upsell' ? (leadingVisual ?? <DefaultIcon />) : <DefaultIcon />
  const hasActions = Boolean(primaryAction || secondaryAction)

  return (
    <BannerContext.Provider value={!title && !composedTitle ? titleId : undefined}>
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
          aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : title ? titleId : composedTitleId)}
          className={cn('primer:@container/banner', banner({variant, layout, flush}), className)}
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
              'primer:grid primer:place-items-center primer:p-2 primer:[&>svg]:h-5',
              hideTitle && !primaryAction && !secondaryAction && 'primer:[&>svg]:h-4',
              iconColor[variant],
            )}
            data-component="Banner.Icon"
          >
            {visual}
          </span>
          <div
            className={cn(
              'primer:min-w-0 primer:items-start primer:gap-1 primer:text-sm primer:leading-normal',
              onDismiss && !hideTitle && actionsLayout !== 'inline'
                ? 'primer:grid'
                : actionsLayout === 'stacked'
                  ? 'primer:flex primer:flex-col'
                  : actionsLayout === 'inline'
                    ? 'primer:flex primer:flex-nowrap primer:justify-between primer:max-[767px]:grid primer:max-[767px]:grid-rows-[auto_auto]'
                    : cn(
                        'primer:flex primer:flex-wrap primer:justify-between primer:@max-[500px]/banner:grid primer:@min-[500px]/banner:grid primer:@min-[500px]/banner:grid-cols-[auto_auto]',
                        hasActions && 'primer:@max-[500px]/banner:grid-rows-[auto_auto]',
                      ),
            )}
          >
            <div
              className={cn(
                'primer:my-2 primer:grid primer:min-w-0 primer:gap-1',
                hideTitle && !hasActions && 'primer:my-1.5',
              )}
              data-component="Banner.Content"
            >
              {title ? (
                hideTitle ? (
                  <span className="primer:sr-only">
                    <BannerTitle id={titleId}>{title}</BannerTitle>
                  </span>
                ) : (
                  <BannerTitle id={titleId}>{title}</BannerTitle>
                )
              ) : null}
              {description ? <BannerDescription>{description}</BannerDescription> : null}
              {renderedChildren}
            </div>
            {hasActions ? <BannerActions primaryAction={primaryAction} secondaryAction={secondaryAction} /> : null}
          </div>
          {onDismiss ? (
            <IconButton
              aria-label="Dismiss banner"
              className={cn('primer:ml-1', hasActions && 'primer:my-0.5', dismissIconColor[variant])}
              icon={XIcon}
              onClick={onDismiss}
              variant="invisible"
            />
          ) : null}
        </section>
      </BannerActionsLayoutContext.Provider>
    </BannerContext.Provider>
  )
})

const iconColor: Record<BannerVariant, string> = {
  critical: 'primer:text-danger',
  info: 'primer:text-accent',
  success: 'primer:text-success',
  upsell: 'primer:text-upsell',
  warning: 'primer:text-attention',
}

// The dismiss button keeps the muted invisible-button colour; only its glyph takes the variant colour.
const dismissIconColor: Record<BannerVariant, string> = {
  critical: 'primer:[&_svg]:text-danger',
  info: 'primer:[&_svg]:text-accent',
  success: 'primer:[&_svg]:text-success',
  upsell: 'primer:[&_svg]:text-upsell',
  warning: 'primer:[&_svg]:text-attention',
}

export interface BannerTitleProps extends React.ComponentPropsWithoutRef<'h2'> {
  /** Heading element to render, so the title fits the surrounding document outline. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function BannerTitle({as: Heading = 'h2', className, id, ...rest}: BannerTitleProps) {
  const titleId = React.useContext(BannerContext)
  return (
    <Heading
      {...rest}
      className={cn('primer:m-0 primer:text-sm primer:font-semibold', className)}
      data-banner-title=""
      data-component="Banner.Title"
      id={id ?? titleId}
    />
  )
}

export function BannerDescription({className, ...rest}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...rest} className={className} data-component="Banner.Description" />
}

export interface BannerActionsProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Most important action, rendered first. */
  primaryAction?: React.ReactNode
  /** Supporting action, rendered after the primary one. */
  secondaryAction?: React.ReactNode
}

export const BannerActions = React.forwardRef<HTMLDivElement, BannerActionsProps>(function BannerActions(
  {className, primaryAction, secondaryAction, ...rest},
  ref,
) {
  const {layout, placeActionsBelowContent} = React.useContext(BannerActionsLayoutContext)
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:w-fit primer:min-w-0 primer:shrink-0',
        placeActionsBelowContent && 'primer:mb-1.5',
        layout === 'default' && 'primer:@max-[500px]/banner:mb-1.5',
        className,
      )}
      data-component="Banner.Actions"
      data-layout={layout}
    >
      <div
        className={cn(
          'primer:flex primer:flex-wrap primer:items-center primer:gap-3 primer:py-0.5',
          layout === 'inline' && 'primer:flex-row-reverse primer:max-[767px]:flex-row',
          layout === 'default' && !placeActionsBelowContent && 'primer:@min-[500px]/banner:flex-row-reverse',
        )}
      >
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  )
})

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

export type BannerPrimaryActionLinkProps = Omit<
  LinkButtonProps,
  'data-component' | 'disabled' | 'inactive' | 'loading' | 'loadingAnnouncement' | 'variant'
>

export const BannerPrimaryActionLink = React.forwardRef<HTMLElement, BannerPrimaryActionLinkProps>(
  function BannerPrimaryActionLink(props, ref) {
    return <LinkButtonBase {...props} ref={ref} variant="default" data-component="Banner.PrimaryActionLink" />
  },
)

export type BannerSecondaryActionLinkProps = Omit<
  LinkButtonProps,
  'data-component' | 'disabled' | 'inactive' | 'loading' | 'loadingAnnouncement' | 'variant'
>

export const BannerSecondaryActionLink = React.forwardRef<HTMLElement, BannerSecondaryActionLinkProps>(
  function BannerSecondaryActionLink(props, ref) {
    return <LinkButtonBase {...props} ref={ref} variant="invisible" data-component="Banner.SecondaryActionLink" />
  },
)
