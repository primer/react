'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {renderIcon, type AccessibleIconName} from '../../internal/icon'
import {IconControlTooltip} from '../../internal/IconControlTooltip'
import {getNotificationIndicatorClassName} from '../Button/notificationIndicator'
import type {IconButtonProps} from '../IconButton'
import {getIconButtonClassName} from '../IconButton/iconButtonClassName'
import {LinkButtonBase, type LinkButtonProps} from '../LinkButton/LinkButton'

interface IconLinkButtonBaseProps
  extends Omit<
    LinkButtonProps,
    | 'alignContent'
    | 'aria-label'
    | 'aria-labelledby'
    | 'block'
    | 'children'
    | 'count'
    | 'data-component'
    | 'disabled'
    | 'inactive'
    | 'labelWrap'
    | 'leadingVisual'
    | 'loading'
    | 'loadingAnnouncement'
    | 'trailingAction'
    | 'trailingVisual'
  > {
  /** Supplementary tooltip text, exposed as the link's accessible description. */
  description?: string
  /** Icon component or rendered element. */
  icon: IconButtonProps['icon']
  /** Keyboard shortcut or alternatives shown in the tooltip; consumers still register the shortcut. */
  keybindingHint?: IconButtonProps['keybindingHint']
  /** Shows a visual activity dot on the link boundary or icon. Describe its meaning in the name or description. */
  notificationIndicator?: IconButtonProps['notificationIndicator']
  /**
   * Side and alignment of the tooltip relative to the link.
   * @default 's'
   */
  tooltipDirection?: IconButtonProps['tooltipDirection']
  /**
   * Skips the default tooltip. The tooltip is also skipped inside an existing Tooltip.
   * @default false
   */
  unsafeDisableTooltip?: boolean
}

/** An icon-only link needs an accessible name from either `aria-label` or `aria-labelledby`. */
export type IconLinkButtonProps = IconLinkButtonBaseProps & AccessibleIconName

export const IconLinkButton = React.forwardRef<HTMLElement, IconLinkButtonProps>(function IconLinkButton(
  {
    'aria-label': ariaLabel,
    className,
    description,
    icon,
    keybindingHint,
    notificationIndicator,
    size = 'medium',
    tooltipDirection = 's',
    unsafeDisableTooltip = false,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const {'aria-expanded': expanded, 'aria-haspopup': hasPopup} = rest
  const {'aria-describedby': describedBy, 'aria-labelledby': labelledBy, id, ...linkProps} = rest
  const hasActivePopup = (expanded === true || expanded === 'true') && Boolean(hasPopup) && hasPopup !== 'false'
  return (
    <IconControlTooltip
      ref={ref}
      id={id}
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      description={description}
      hasActivePopup={hasActivePopup}
      keybindingHint={keybindingHint}
      label={ariaLabel}
      tooltipDirection={tooltipDirection}
      unsafeDisableTooltip={unsafeDisableTooltip}
    >
      <LinkButtonBase
        {...linkProps}
        aria-label={labelledBy ? undefined : ariaLabel}
        className={cn(
          getIconButtonClassName({size, variant}),
          notificationIndicator && getNotificationIndicatorClassName(notificationIndicator),
          className,
        )}
        data-component="IconLinkButton"
        data-notification-indicator={notificationIndicator}
        size={size}
        variant={variant}
      >
        {renderIcon(icon, 'primer:block')}
      </LinkButtonBase>
    </IconControlTooltip>
  )
})

IconLinkButton.displayName = 'IconLinkButton'
