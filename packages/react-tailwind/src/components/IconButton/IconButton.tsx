'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {renderIcon, type IconSource} from '../../internal/icon'
import {Button, type ButtonProps} from '../Button'
import {getNotificationIndicatorClassName, type NotificationIndicatorPlacement} from '../Button/notificationIndicator'
import {Tooltip} from '../Tooltip/Tooltip'
import {useIsInsideTooltip} from '../Tooltip/TooltipContext'
import {tooltipDirectionPlacement, type TooltipDirection} from '../Tooltip/direction'
import {getIconButtonClassName} from './iconButtonClassName'

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'leadingVisual' | 'notificationIndicator' | 'trailingVisual'> {
  /** Accessible name for the button. Required, because the icon alone conveys nothing to assistive technology. */
  'aria-label': string
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
   * Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, the
   * tooltip repeats `aria-label` visually.
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
  const insideTooltip = useIsInsideTooltip()
  const buttonProps = {
    ...rest,
    'aria-label': ariaLabel,
    children: renderIcon(icon, 'block'),
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

  if (unsafeDisableTooltip || insideTooltip || !ariaLabel) {
    return <Button {...buttonProps} ref={ref} />
  }

  const {'aria-expanded': expanded, 'aria-haspopup': hasPopup} = rest
  const hasActivePopup = (expanded === true || expanded === 'true') && Boolean(hasPopup) && hasPopup !== 'false'
  const placement = tooltipDirectionPlacement[tooltipDirection]
  // Render-element props override the trigger's, so ARIA references go through the trigger to merge with the tooltip,
  // and `id` goes through it so the trigger tracks the same element it renders.
  const {'aria-describedby': describedBy, 'aria-labelledby': labelledBy, id, ...triggerButtonProps} = buttonProps
  return (
    <Tooltip.Root keybindingHint={keybindingHint} type={description ? 'description' : 'label'}>
      <Tooltip.Trigger
        ref={ref}
        id={id}
        aria-describedby={describedBy}
        aria-labelledby={labelledBy}
        disabled={disabled || hasActivePopup}
        render={<Button {...triggerButtonProps} />}
      />
      <Tooltip.Content align={placement.align} side={placement.side}>
        {description || ariaLabel}
      </Tooltip.Content>
    </Tooltip.Root>
  )
})
