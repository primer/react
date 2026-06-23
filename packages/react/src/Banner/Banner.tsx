import React, {forwardRef} from 'react'
import {useDevOnlyEffect} from '../internal/hooks/useDevOnlyEffect'
import {AlertIcon, InfoIcon, StopIcon, CheckCircleIcon, XIcon} from '@primer/octicons-react'
import {Button, IconButton, type ButtonProps} from '../Button'
import {VisuallyHidden} from '../VisuallyHidden'
import {useMergedRefs} from '../hooks/useMergedRefs'
import {useId} from '../hooks/useId'
import './Banner.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type BannerCustomElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  class?: string
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ds-banner': BannerCustomElementProps & {
        'actions-layout'?: string
        dismissible?: string
        flush?: string
        'has-actions'?: string
        layout?: string
        'title-hidden'?: string
        variant?: string
      }
      'ds-banner-actions': BannerCustomElementProps
      'ds-banner-actions-container': BannerCustomElementProps & {
        dismissible?: string
        'primary-action'?: string
      }
      'ds-banner-container': BannerCustomElementProps
      'ds-banner-content': BannerCustomElementProps
      'ds-banner-description': BannerCustomElementProps
      'ds-banner-dismiss': BannerCustomElementProps
      'ds-banner-icon': BannerCustomElementProps
      'ds-banner-title': BannerCustomElementProps
    }
  }
}

export type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning'

type BannerContextValue = {
  titleId: string
}

const BannerContext = React.createContext<BannerContextValue | undefined>(undefined)

export type BannerProps = React.ComponentPropsWithoutRef<'section'> & {
  /**
   * Provide an optional label to override the default name for the Banner
   * landmark region
   */
  'aria-label'?: string

  /**
   * Provide an optional className to add to the outermost element rendered by
   * the Banner
   */
  className?: string

  /**
   * Provide an optional description for the Banner. This should provide
   * supplemental information about the Banner
   */
  description?: React.ReactNode

  /**
   * Specify whether the title of the Banner should be visible or not.
   */
  hideTitle?: boolean

  /**
   * Provide a custom icon for the Banner. This is only available when `variant` is `info` or `upsell`
   * @deprecated Use `leadingVisual` instead
   */
  icon?: React.ReactNode

  /**
   * Provide a custom leading visual for the Banner. This is only available when `variant` is `info` or `upsell`
   */
  leadingVisual?: React.ReactNode

  /**
   * Optionally provide a handler to be called when the banner is dismissed.
   * Providing this prop will show a dismiss button.
   */
  onDismiss?: () => void

  /**
   * Provide an optional primary action for the Banner.
   */
  primaryAction?: React.ReactNode

  /**
   * Provide an optional secondary action for the Banner
   */
  secondaryAction?: React.ReactNode

  /**
   * The title for the Banner. This will be used as the accessible name and is
   * required unless `Banner.Title` is used as a child.
   */
  title?: React.ReactNode

  /**
   * Specify the type of the Banner
   */
  variant?: BannerVariant

  /**
   * Specify the layout of the Banner. Compact layout will reduce the padding.
   */
  layout?: 'default' | 'compact'

  /**
   * Override the default actions layout behavior
   */
  actionsLayout?: 'inline' | 'stacked' | 'default'

  /**
   * Full width banner specifically for use within confined spaces, such as dialogs, tables, cards, or boxes where available space is limited.
   */
  flush?: boolean
}

const iconForVariant: Record<BannerVariant, React.ReactNode> = {
  critical: <StopIcon />,
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  upsell: <InfoIcon />,
  warning: <AlertIcon />,
}

export const Banner = React.forwardRef<HTMLElement, BannerProps>(function Banner(
  {
    'aria-label': label,
    'aria-labelledby': labelledBy,
    children,
    className,
    description,
    hideTitle,
    icon,
    leadingVisual,
    onDismiss,
    primaryAction,
    secondaryAction,
    title,
    variant = 'info',
    layout = 'default',
    actionsLayout = 'default',
    flush = false,
    ...rest
  },
  forwardRef,
) {
  const dismissible = !!onDismiss
  const hasActions = primaryAction || secondaryAction
  const bannerRef = React.useRef<HTMLElement>(null)
  const ref = useMergedRefs(forwardRef, bannerRef)
  const supportsCustomIcon = variant === 'info' || variant === 'upsell'
  const titleId = useId()

  const visual = leadingVisual ?? icon

  useDevOnlyEffect(() => {
    if (title) {
      return
    }

    const {current: banner} = bannerRef
    if (!banner) {
      return
    }

    const hasTitle = banner.querySelector('[banner-title]')
    if (!hasTitle) {
      throw new Error(
        'Expected a title to be provided to the <Banner> component with the `title` prop or through `<Banner.Title>` but no title was found',
      )
    }
  }, [title])

  return (
    <BannerContext.Provider value={{titleId}}>
      <section
        data-component="Banner"
        {...rest}
        aria-labelledby={labelledBy ?? (label ? undefined : titleId)}
        aria-label={labelledBy ? undefined : label}
        className={className}
        tabIndex={-1}
        ref={ref}
      >
        <ds-banner
          dismissible={onDismiss ? '' : undefined}
          has-actions={hasActions ? '' : undefined}
          title-hidden={hideTitle ? '' : undefined}
          variant={variant}
          actions-layout={actionsLayout}
          layout={layout}
          flush={flush ? '' : undefined}
        >
          <ds-banner-icon data-component="Banner.Icon">
            {visual && supportsCustomIcon ? visual : iconForVariant[variant]}
          </ds-banner-icon>
          <ds-banner-container>
            <ds-banner-content data-component="Banner.Content">
              {title ? (
                hideTitle ? (
                  <VisuallyHidden>
                    <BannerTitle>{title}</BannerTitle>
                  </VisuallyHidden>
                ) : (
                  <BannerTitle>{title}</BannerTitle>
                )
              ) : null}
              {description ? <BannerDescription>{description}</BannerDescription> : null}
              {children}
            </ds-banner-content>
            {hasActions ? (
              <BannerActions
                dismissible={dismissible}
                primaryAction={primaryAction}
                secondaryAction={secondaryAction}
              />
            ) : null}
          </ds-banner-container>
          {dismissible ? (
            <ds-banner-dismiss>
              <IconButton aria-label="Dismiss banner" onClick={onDismiss} icon={XIcon} variant="invisible" />
            </ds-banner-dismiss>
          ) : null}
        </ds-banner>
      </section>
    </BannerContext.Provider>
  )
})

type HeadingElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type BannerTitleProps<As extends HeadingElement> = {
  as?: As
  className?: string
} & React.ComponentPropsWithoutRef<As extends 'h2' ? 'h2' : As>

export function BannerTitle<As extends HeadingElement>(props: BannerTitleProps<As>) {
  const {as: Heading = 'h2', className, children, id, ...rest} = props
  const context = React.useContext(BannerContext)
  const titleId = id ?? context?.titleId

  return (
    <ds-banner-title>
      {React.createElement(
        Heading,
        {
          ...rest,
          id: titleId,
          className,
          'data-component': 'Banner.Title',
          'banner-title': '',
        },
        children,
      )}
    </ds-banner-title>
  )
}

export type BannerDescriptionProps = React.ComponentPropsWithoutRef<'ds-banner-description'>

export function BannerDescription({children, className, ...rest}: BannerDescriptionProps) {
  return (
    <ds-banner-description {...rest} class={className} data-component="Banner.Description">
      {children}
    </ds-banner-description>
  )
}

export type BannerActionsProps = {
  dismissible?: boolean
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function BannerActions({dismissible, primaryAction, secondaryAction}: BannerActionsProps) {
  return (
    <ds-banner-actions data-component="Banner.Actions">
      <ds-banner-actions-container dismissible={dismissible ? '' : undefined} primary-action="trailing">
        {secondaryAction ?? null}
        {primaryAction ?? null}
      </ds-banner-actions-container>
      <ds-banner-actions-container primary-action="leading">
        {primaryAction ?? null}
        {secondaryAction ?? null}
      </ds-banner-actions-container>
    </ds-banner-actions>
  )
}

export type BannerPrimaryActionProps = Omit<ButtonProps, 'variant'>

const BannerPrimaryAction = forwardRef(({children, className, ...rest}, forwardedRef) => {
  return (
    <Button data-component="Banner.PrimaryAction" ref={forwardedRef} className={className} variant="default" {...rest}>
      {children}
    </Button>
  )
}) as PolymorphicForwardRefComponent<'button', BannerPrimaryActionProps>

BannerPrimaryAction.displayName = 'BannerPrimaryAction'

export type BannerSecondaryActionProps = Omit<ButtonProps, 'variant'>

const BannerSecondaryAction = forwardRef(({children, className, ...rest}, forwardedRef) => {
  return (
    <Button
      data-component="Banner.SecondaryAction"
      ref={forwardedRef}
      className={className}
      variant="invisible"
      {...rest}
    >
      {children}
    </Button>
  )
}) as PolymorphicForwardRefComponent<'button', BannerSecondaryActionProps>

BannerSecondaryAction.displayName = 'BannerSecondaryAction'

export {BannerPrimaryAction, BannerSecondaryAction}
