import {clsx} from 'clsx'
import React, {forwardRef, useEffect} from 'react'
import {AlertIcon, InfoIcon, StopIcon, CheckCircleIcon, XIcon} from '@primer/octicons-react'
import {Button, IconButton, type ButtonProps} from '../Button'
import {VisuallyHidden} from '../VisuallyHidden'
import {useMergedRefs} from '../internal/hooks/useMergedRefs'
import classes from './Banner.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning'

export type BannerProps = React.ComponentPropsWithoutRef<'section'> & {
  /**
   * Provide an optional label to override the default name for the Banner
   * landmark region
   */
  'aria-label'?: string
  'aria-labelledby'?: string

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
   */
  icon?: React.ReactNode

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
}

const iconForVariant: Record<BannerVariant, React.ReactNode> = {
  critical: <StopIcon />,
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  upsell: <InfoIcon />,
  warning: <AlertIcon />,
}

const labels: Record<BannerVariant, string> = {
  critical: 'Critical',
  info: 'Information',
  success: 'Success',
  upsell: 'Recommendation',
  warning: 'Warning',
}

export const Banner = React.forwardRef<HTMLElement, BannerProps>(function Banner(
  {
    'aria-label': label,
    'aria-labelledby': ariaLabelledby,
    children,
    className,
    description,
    hideTitle,
    icon,
    onDismiss,
    primaryAction,
    secondaryAction,
    title,
    variant = 'info',
    ...rest
  },
  forwardRef,
) {
  const dismissible = !!onDismiss
  const hasActions = primaryAction || secondaryAction
  const bannerRef = React.useRef<HTMLElement>(null)
  const ref = useMergedRefs(forwardRef, bannerRef)
  const supportsCustomIcon = variant === 'info' || variant === 'upsell'

  if (__DEV__) {
    // This hook is called consistently depending on the environment
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (title) {
        return
      }

      const {current: banner} = bannerRef
      if (!banner) {
        return
      }

      const hasTitle = banner.querySelector('[data-banner-title]')
      if (!hasTitle) {
        throw new Error(
          'Expected a title to be provided to the <Banner> component with the `title` prop or through `<Banner.Title>` but no title was found',
        )
      }
    }, [title])
  }

  return (
    <section
      {...rest}
      aria-label={label ?? labels[variant]}
      aria-labelledby={ariaLabelledby ?? title}
      className={clsx(className, classes.Banner)}
      data-dismissible={onDismiss ? '' : undefined}
      data-title-hidden={hideTitle ? '' : undefined}
      data-variant={variant}
      tabIndex={-1}
      ref={ref}
    >
      <div className={classes.BannerIcon}>{icon && supportsCustomIcon ? icon : iconForVariant[variant]}</div>
      <div className={classes.BannerContainer}>
        <div className={classes.BannerContent}>
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
        </div>
        {hasActions ? <BannerActions primaryAction={primaryAction} secondaryAction={secondaryAction} /> : null}
      </div>
      {dismissible ? (
        <IconButton
          aria-label="Dismiss banner"
          onClick={onDismiss}
          className={classes.BannerDismiss}
          icon={XIcon}
          variant="invisible"
        />
      ) : null}
    </section>
  )
})

type HeadingElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type BannerTitleProps<As extends HeadingElement> = {
  as?: As
  className?: string
} & React.ComponentPropsWithoutRef<As extends 'h2' ? 'h2' : As>

export function BannerTitle<As extends HeadingElement>(props: BannerTitleProps<As>) {
  const {as: Heading = 'h2', className, children, ...rest} = props
  return (
    <Heading {...rest} className={clsx(className, classes.BannerTitle)} data-banner-title="">
      {children}
    </Heading>
  )
}

export type BannerDescriptionProps = React.ComponentPropsWithoutRef<'div'>

export function BannerDescription({children, className, ...rest}: BannerDescriptionProps) {
  return (
    <div {...rest} className={clsx('BannerDescription', className)}>
      {children}
    </div>
  )
}

export type BannerActionsProps = {
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function BannerActions({primaryAction, secondaryAction}: BannerActionsProps) {
  return (
    <div className={classes.BannerActions}>
      <div className={classes.BannerActionsContainer} data-primary-action="trailing">
        {secondaryAction ?? null}
        {primaryAction ?? null}
      </div>
      <div className={classes.BannerActionsContainer} data-primary-action="leading">
        {primaryAction ?? null}
        {secondaryAction ?? null}
      </div>
    </div>
  )
}

export type BannerPrimaryActionProps = Omit<ButtonProps, 'variant'>

const BannerPrimaryAction = forwardRef(({children, className, ...rest}, forwardedRef) => {
  return (
    <Button ref={forwardedRef} className={clsx('BannerPrimaryAction', className)} variant="default" {...rest}>
      {children}
    </Button>
  )
}) as PolymorphicForwardRefComponent<'button', BannerPrimaryActionProps>

BannerPrimaryAction.displayName = 'BannerPrimaryAction'

export type BannerSecondaryActionProps = Omit<ButtonProps, 'variant'>

const BannerSecondaryAction = forwardRef(({children, className, ...rest}, forwardedRef) => {
  return (
    <Button ref={forwardedRef} className={clsx('BannerPrimaryAction', className)} variant="link" {...rest}>
      {children}
    </Button>
  )
}) as PolymorphicForwardRefComponent<'button', BannerSecondaryActionProps>

BannerSecondaryAction.displayName = 'BannerSecondaryAction'

export {BannerPrimaryAction, BannerSecondaryAction}
