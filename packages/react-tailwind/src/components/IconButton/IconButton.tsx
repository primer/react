'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {renderIcon, type AccessibleIconName, type IconSource} from '../../internal/icon'
import {IconControlTooltip} from '../../internal/IconControlTooltip'
import {Button, type ButtonProps} from '../Button'
import {getNotificationIndicatorClassName, type NotificationIndicatorPlacement} from '../Button/notificationIndicator'
import type {TooltipDirection} from '../Tooltip/direction'
import {getIconButtonClassName} from './iconButtonClassName'

interface IconButtonBaseProps
  extends Omit<
    ButtonProps,
    'aria-label' | 'aria-labelledby' | 'children' | 'leadingVisual' | 'notificationIndicator' | 'trailingVisual'
  > {
  /**
   * Icon to render: a component such as an Octicon, or a rendered element. Pass an element when the icon comes
   * from a Server Component.
   */
  icon: IconSource
  /**
   * Shows a dot for new activity on the button boundary or on the icon. The dot is not announced, so describe the
   * activity in the accessible name or description.
   */
  notificationIndicator?: Exclude<NotificationIndicatorPlacement, 'leadingVisual'>
  /**
   * Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, a
   * supplied `aria-label` is repeated visually as a tooltip.
   */
  description?: string
  /**
   * Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`.
   * Displays the hint only; the consumer still registers the shortcut.
   */
  keybindingHint?: string | string[]
  /**
   * Side and alignment of the tooltip relative to the button.
   * @default 's'
   */
  tooltipDirection?: TooltipDirection
  /**
   * Skips the default tooltip. Prefer keeping it; IconButton also skips it automatically inside an existing Tooltip.
   * @default false
   */
  unsafeDisableTooltip?: boolean
}

/** An icon-only button needs an accessible name from either `aria-label` or `aria-labelledby`. */
export type IconButtonProps = IconButtonBaseProps & AccessibleIconName

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  {
    'aria-label': ariaLabel,
    className,
    'data-component': dataComponent = 'IconButton',
    description,
    disabled,
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
  const buttonProps = {
    ...rest,
    // `aria-labelledby` takes precedence, so a redundant `aria-label` is dropped.
    'aria-label': rest['aria-labelledby'] ? undefined : ariaLabel,
    children: renderIcon(icon, 'primer:block'),
    className: cn(
      getIconButtonClassName({inactive: rest.inactive, size, variant}),
      notificationIndicator && getNotificationIndicatorClassName(notificationIndicator),
      className,
    ),
    'data-component': dataComponent,
    'data-notification-indicator': notificationIndicator,
    disabled,
    size,
    variant,
  } satisfies ButtonProps & {'data-notification-indicator'?: string}

  const {'aria-expanded': expanded, 'aria-haspopup': hasPopup} = rest
  const hasActivePopup = (expanded === true || expanded === 'true') && Boolean(hasPopup) && hasPopup !== 'false'
  const {'aria-describedby': describedBy, 'aria-labelledby': labelledBy, id, ...triggerButtonProps} = buttonProps
  return (
    <IconControlTooltip
      ref={ref}
      id={id}
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      description={description}
      disabled={disabled}
      hasActivePopup={hasActivePopup}
      keybindingHint={keybindingHint}
      label={ariaLabel}
      tooltipDirection={tooltipDirection}
      unsafeDisableTooltip={unsafeDisableTooltip}
    >
      <Button {...triggerButtonProps} labelWrap={triggerButtonProps.labelWrap ?? false} />
    </IconControlTooltip>
  )
})
