import cx from 'clsx'
import React, {createContext, useContext, useId, useMemo} from 'react'
import styled from 'styled-components'
import {AlertIcon, InfoIcon, StopIcon, CheckCircleIcon, XIcon} from '@primer/octicons-react'
import {Button, IconButton} from '../Button'
import {get} from '../constants'

type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning'

export type BannerProps = React.ComponentPropsWithoutRef<'section'> & {
  /**
   * Optionally provide a handler to be called when the banner is dismissed.
   * Providing this prop will show a dismiss button.
   *
   * Note: This is not available for critical banners.
   */
  onDismiss?: () => void

  /**
   * Provide an icon for the banner.
   * Note: Only `variant="info"` banners should use custom icons
   */
  icon?: React.ReactNode

  /**
   * Optionally provide a title for the banner
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

export function Banner({children, onDismiss, title, variant = 'info', ...rest}: BannerProps) {
  const titleId = useId()
  const value = useMemo(() => {
    return {
      titleId,
    }
  }, [titleId])
  const icon = iconForVariant[variant]
  const dismissible = variant !== 'critical' && onDismiss

  return (
    <BannerContext.Provider value={value}>
      <StyledBanner aria-labelledby={titleId} as="section" {...rest} data-variant={variant} tabIndex={-1}>
        <div className="BannerIcon">{icon}</div>
        <div className="BannerContainer">{children}</div>
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
}

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
  border: 1px solid var(--banner-borderColor);
  padding: 0.5rem;
  border-radius: ${get('radii.2')};

  &[data-variant='critical'] {
    --banner-bgColor: ${get('colors.danger.subtle')};
    --banner-borderColor: ${get('colors.danger.muted')};
    --banner-icon-bgColor: ${get('colors.danger.fg')};
  }

  &[data-variant='info'] {
    --banner-bgColor: ${get('colors.accent.subtle')};
    --banner-borderColor: ${get('colors.accent.muted')};
    --banner-icon-bgColor: ${get('colors.accent.fg')};
  }

  &[data-variant='success'] {
    --banner-bgColor: ${get('colors.success.subtle')};
    --banner-borderColor: ${get('colors.success.muted')};
    --banner-icon-bgColor: ${get('colors.success.fg')};
  }

  &[data-variant='upsell'] {
    --banner-bgColor: ${get('colors.done.subtle')};
    --banner-borderColor: ${get('colors.done.muted')};
    --banner-icon-bgColor: ${get('colors.done.fg')};
  }

  &[data-variant='warning'] {
    --banner-bgColor: ${get('colors.attention.subtle')};
    --banner-borderColor: ${get('colors.attention.muted')};
    --banner-icon-bgColor: ${get('colors.attention.fg')};
  }

  /* BannerIcon ------------------------------------------------------------- */
  .BannerIcon {
    display: grid;
    place-items: center;
    padding: 0.5rem;
  }

  .BannerIcon svg {
    color: var(--banner-icon-bgColor);
    fill: var(--banner-icon-bgColor);
    height: 1.25rem;
  }

  /* BannerContainer -------------------------------------------------------- */
  .BannerContainer {
    display: grid;
    font-size: 0.875rem;
    align-items: start;
    line-height: calc(20 / 14);
    row-gap: 0.25rem;
    column-gap: 0.25rem;
  }

  /* BannerContent ---------------------------------------------------------- */
  .BannerContent {
    display: grid;
    row-gap: 0.25rem;
    grid-column-start: 1;
    margin-block: 0.5rem;
  }

  .BannerTitle {
    margin: 0;
    font-size: inherit;
    font-weight: 600;
  }

  /* BannerActions ---------------------------------------------------------- */

  .BannerActionsContainer {
    display: flex;
    column-gap: 0.5rem;
    align-items: center;
    /* padding-block: 0.5rem; */
  }

  .BannerActions [data-hide-on-sm] {
    display: none;
  }

  @media screen and (min-width: 544px) {
    .BannerActionsContainer {
      column-gap: 0.25rem;
    }

    .BannerActions {
      grid-column-start: 2;
      grid-row-start: 1;
    }

    .BannerActions [data-hide-on-sm] {
      display: flex;
    }

    .BannerActions [data-hide-on-md] {
      display: none;
    }
  }

  /* BannerDismiss ---------------------------------------------------------- */

  .BannerDismiss {
    display: grid;
    place-items: center;
    padding: 0.5rem;
    width: 2rem;
    height: 2rem;
    margin-inline-start: 0.25rem;
  }

  .BannerDismiss svg {
    color: var(--banner-icon-bgColor);
  }
`

export type BannerContentProps = React.PropsWithChildren

export function BannerContent({children}: BannerContentProps) {
  return <div className="BannerContent">{children}</div>
}

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type BannerTitleProps<As extends HeadingElement> = {
  as?: As
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

export type BannerDescriptionProps = React.PropsWithChildren<{}>

export function BannerDescription({children}: BannerDescriptionProps) {
  return <div className="BannerDescription">{children}</div>
}

export type BannerActionsProps = {
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function BannerActions({primaryAction, secondaryAction}: BannerActionsProps) {
  return (
    <div className="BannerActions">
      <div className="BannerActionsContainer" data-hide-on-sm="">
        {secondaryAction ?? null}
        {primaryAction ?? null}
      </div>
      <div className="BannerActionsContainer" data-hide-on-md="">
        {primaryAction ?? null}
        {secondaryAction ?? null}
      </div>
    </div>
  )
}

export type BannerPrimaryActionProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'variant'>

export function BannerPrimaryAction({children, ...rest}: BannerPrimaryActionProps) {
  return (
    <Button {...rest} className="BannerPrimaryAction" variant="default">
      {children}
    </Button>
  )
}

export type BannerSecondaryActionProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'variant'>

export function BannerSecondaryAction({children, ...rest}: BannerSecondaryActionProps) {
  return (
    <Button {...rest} className="BannerPrimaryAction" variant="invisible">
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
