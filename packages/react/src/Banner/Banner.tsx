import cx from 'clsx'
import React, {createContext, useContext, useEffect, useId, useMemo} from 'react'
import styled from 'styled-components'
import {AlertIcon, InfoIcon, StopIcon, CheckCircleIcon, XIcon} from '@primer/octicons-react'
import {Button, IconButton} from '../Button'
import {get} from '../constants'

type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning'

export type BannerProps = React.ComponentPropsWithoutRef<'section'> & {
  /**
   * Provide an optional description for the Banner. This should provide
   * supplemental information about the Banner
   */
  description?: React.ReactNode

  /**
   * Provide an icon for the banner.
   * Note: Only `variant="info"` banners should use custom icons
   */
  icon?: React.ReactNode

  /**
   * Optionally provide a handler to be called when the banner is dismissed.
   * Providing this prop will show a dismiss button.
   *
   * Note: This is not available for critical banners.
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

export const Banner = React.forwardRef<HTMLElement, BannerProps>(function Banner(
  {children, description, icon, onDismiss, primaryAction, secondaryAction, title, variant = 'info', ...rest},
  ref,
) {
  const titleId = useId()
  const value = useMemo(() => {
    return {
      titleId,
    }
  }, [titleId])
  const dismissible = variant !== 'critical' && onDismiss
  const hasActions = primaryAction || secondaryAction

  if (__DEV__) {
    // Note: __DEV__ will make it so that this hook is consistently called, or
    // not called, depending on environment
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const title = document.getElementById(titleId)
      if (!title) {
        throw new Error(
          'The Banner component requires a title to be provided as the `title` prop or through `Banner.Title`',
        )
      }
    }, [titleId])
  }

  return (
    <BannerContext.Provider value={value}>
      <StyledBanner {...rest} aria-labelledby={titleId} as="section" data-variant={variant} tabIndex={-1} ref={ref}>
        <style>{BannerContainerQuery}</style>
        <div className="BannerIcon">{icon && variant === 'info' ? icon : iconForVariant[variant]}</div>
        <div className="BannerContainer">
          <div className="BannerContent">
            {title ? <BannerTitle>{title}</BannerTitle> : null}
            {description ? <BannerDescription>{description}</BannerDescription> : null}
            {children}
          </div>
          {hasActions ? <BannerActions primaryAction={primaryAction} secondaryAction={secondaryAction} /> : null}
        </div>
        {dismissible ? (
          <IconButton
            aria-label="Dismiss banner"
            onClick={onDismiss}
            className="BannerDismiss"
            icon={XIcon}
            variant="invisible"
          />
        ) : null}
      </StyledBanner>
    </BannerContext.Provider>
  )
})

/**
 * For styling, it's important that the icons and the text have the same height
 * for alignment to occur in multi-line scenarios. Currently, we use a
 * line-height of `20px` so that means that the height of icons should match
 * that value.
 */
const StyledBanner = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  background-color: var(--banner-bgColor);
  border: var(--borderWidth-thin, 1px) solid var(--banner-borderColor);
  padding: var(--base-size-8, 0.5rem);
  border-radius: var(--borderRadius-medium, ${get('radii.2')});

  @supports (container-type: inline-size) {
    // container: banner / inline-size;
  }

  &[data-variant='critical'] {
    --banner-bgColor: ${get('colors.danger.subtle')};
    --banner-borderColor: ${get('colors.danger.muted')};
    --banner-icon-fgColor: ${get('colors.danger.fg')};
  }

  &[data-variant='info'] {
    --banner-bgColor: ${get('colors.accent.subtle')};
    --banner-borderColor: ${get('colors.accent.muted')};
    --banner-icon-fgColor: ${get('colors.accent.fg')};
  }

  &[data-variant='success'] {
    --banner-bgColor: ${get('colors.success.subtle')};
    --banner-borderColor: ${get('colors.success.muted')};
    --banner-icon-fgColor: ${get('colors.success.fg')};
  }

  &[data-variant='upsell'] {
    --banner-bgColor: var(--bgColor-upsell-muted, ${get('colors.done.subtle')});
    --banner-borderColor: var(--borderColor-upsell-muted, ${get('colors.done.muted')});
    --banner-icon-fgColor: var(--fgColor-upsell-muted, ${get('colors.done.fg')});
  }

  &[data-variant='warning'] {
    --banner-bgColor: ${get('colors.attention.subtle')};
    --banner-borderColor: ${get('colors.attention.muted')};
    --banner-icon-fgColor: ${get('colors.attention.fg')};
  }

  /* BannerIcon ------------------------------------------------------------- */

  .BannerIcon {
    display: grid;
    place-items: center;
    padding: var(--base-size-8, 0.5rem);
  }

  .BannerIcon svg {
    color: var(--banner-icon-fgColor);
    fill: var(--banner-icon-fgColor);
    /* 20px is the line box height of the trailing action buttons */
    height: var(--base-size-20, 1.25rem);
  }

  /* BannerContainer -------------------------------------------------------- */

  .BannerContainer {
    font-size: var(--text-body-size-medium, 0.875rem);
    align-items: start;
    line-height: var(--text-body-lineHeight-medium, calc(20 / 14));
    row-gap: var(--base-size-4, 0.25rem);
    column-gap: var(--base-size-4, 0.25rem);
  }

  & :where(.BannerContainer) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  /* BannerContent ---------------------------------------------------------- */

  .BannerContent {
    display: grid;
    row-gap: var(--base-size-4, 0.25rem);
    grid-column-start: 1;
    margin-block: var(--base-size-8, 0.5rem);
  }

  @media screen and (min-width: 544px) {
    .BannerContent {
      flex: 1 1 0%;
    }
  }

  .BannerTitle {
    margin: 0;
    font-size: inherit;
    font-weight: var(--base-text-weight-semibold, 600);
  }

  /* BannerActions ---------------------------------------------------------- */
  .BannerActionsContainer {
    display: flex;
    column-gap: var(--base-size-8, 0.5rem);
    align-items: center;
  }

  .BannerActions :where([data-primary-action='trailing']) {
    display: none;
  }

  @media screen and (min-width: 544px) {
    .BannerActions :where([data-primary-action='trailing']) {
      display: flex;
    }

    .BannerActions :where([data-primary-action='leading']) {
      display: none;
    }
  }

  /* BannerDismiss ---------------------------------------------------------- */

  .BannerDismiss {
    display: grid;
    place-items: center;
    padding: var(--base-size-8, 0.5rem);
    margin-inline-start: var(--base-size-4, 0.25rem);
  }

  .BannerDismiss svg {
    color: var(--banner-icon-fgColor);
  }
`

const BannerContainerQuery = `
  @container banner (max-width: 500px) {
    .BannerActions [data-primary-action="trailing"] {
      display: none;
    }

    .BannerActions [data-primary-action="leading"] {
      display: flex;
    }
  }

  @container banner (min-width: 500px) {
    .BannerContainer {
      display: grid;
      grid-template-columns: auto auto;
    }

    .BannerActions [data-primary-action="trailing"] {
      display: flex;
    }

    .BannerActions [data-primary-action="leading"] {
      display: none;
    }
  }
`

type HeadingElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type BannerTitleProps<As extends HeadingElement> = {
  as?: As
  className?: string
} & React.ComponentPropsWithoutRef<As extends 'h2' ? 'h2' : As>

export function BannerTitle<As extends HeadingElement>(props: BannerTitleProps<As>) {
  const {as: Heading = 'h2', className, children, ...rest} = props
  const banner = useBanner()

  return (
    <Heading {...rest} id={banner.titleId} className={cx('BannerTitle', className)}>
      {children}
    </Heading>
  )
}

export type BannerDescriptionProps = React.ComponentPropsWithoutRef<'div'>

export function BannerDescription({children, className, ...rest}: BannerDescriptionProps) {
  return (
    <div {...rest} className={cx('BannerDescription', className)}>
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
    <div className="BannerActions">
      <div className="BannerActionsContainer" data-primary-action="trailing">
        {secondaryAction ?? null}
        {primaryAction ?? null}
      </div>
      <div className="BannerActionsContainer" data-primary-action="leading">
        {primaryAction ?? null}
        {secondaryAction ?? null}
      </div>
    </div>
  )
}

export type BannerPrimaryActionProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'variant'>

export function BannerPrimaryAction({children, className, ...rest}: BannerPrimaryActionProps) {
  return (
    <Button className={cx('BannerPrimaryAction', className)} variant="default" {...rest}>
      {children}
    </Button>
  )
}

export type BannerSecondaryActionProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'variant'>

export function BannerSecondaryAction({children, className, ...rest}: BannerSecondaryActionProps) {
  return (
    <Button className={cx('BannerPrimaryAction', className)} variant="invisible" {...rest}>
      {children}
    </Button>
  )
}

type BannerContextValue = {titleId: string}
const BannerContext = createContext<BannerContextValue | null>(null)

function useBanner(): BannerContextValue {
  const value = useContext(BannerContext)
  if (value) {
    return value
  }
  throw new Error('Component must be used within a <Banner> component')
}
