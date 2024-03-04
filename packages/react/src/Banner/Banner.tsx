import React, {useId} from 'react'
import styled from 'styled-components'
import {AlertIcon, InfoIcon, StopIcon, CheckCircleIcon, XIcon} from '@primer/octicons-react'
import {Button as ButtonReset} from '../internal/components/ButtonReset'
import {Button} from '../Button'
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
  const icon = iconForVariant[variant]
  const dismissible = variant !== 'critical' && onDismiss

  return (
    <StyledBanner
      aria-labelledby={title ? titleId : undefined}
      as="section"
      {...rest}
      data-variant={variant}
      data-title-only={children === undefined ? true : undefined}
      tabIndex={-1}
    >
      <div className="BannerIcon">{icon}</div>
      <div className="BannerContent">
        {title ? (
          <h2 className="BannerTitle" id={titleId}>
            {title}
          </h2>
        ) : null}
        {children}
      </div>
      {dismissible ? (
        <ButtonReset aria-label="Dismiss banner" onClick={onDismiss} className="BannerDismiss">
          <XIcon />
        </ButtonReset>
      ) : null}
    </StyledBanner>
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
  grid-template-columns: auto 1fr auto;
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
    fill: var(--banner-icon-bgColor);
    height: 1.25rem;
  }

  /* BannerContent----------------------------------------------------------- */
  .BannerContent {
    display: grid;
    row-gap: 0.25rem;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    line-height: calc(20 / 14);
    // column-gap: 0.5rem;
    // align-items: center;
    /* grid-template-areas: 'title' 'description' 'actions'; */
  }

  .BannerTitle {
    margin: 0;
    font-size: inherit;
    // display: grid;
    // align-items: center;
    /* grid-area: title; */
  }

  &:not([data-title-only]) .BannerTitle {
    font-weight: ${get('fontWeights.bold')};
  }

  .BannerDescription {
    /* grid-area: description; */
  }

  /* BannerActions ---------------------------------------------------------- */

  .BannerActions {
    display: flex;
    column-gap: 0.5rem;
    align-items: center;
    padding-block: 0.5rem;
    /* grid-area: actions; */
  }

  /* BannerDismiss ---------------------------------------------------------- */

  .BannerDismiss {
    display: grid;
    place-items: center;
    padding: 0.5rem;
    width: 2rem;
    height: 2.25rem;
  }

  .BannerDismiss svg {
    fill: var(--banner-icon-bgColor);
  }
`

export type BannerDescriptionProps = React.PropsWithChildren<{}>

export function BannerDescription({children}: BannerDescriptionProps) {
  return <div className="BannerDescription">{children}</div>
}

export type BannerActionsProps = React.PropsWithChildren<{}>

export function BannerActions({children}: BannerActionsProps) {
  return <div className="BannerActions">{children}</div>
}

export type BannerPrimaryActionProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'variant'>

export function BannerPrimaryAction({children, ...rest}: BannerActionsProps) {
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
