'use client'

import React from 'react'
import {Tooltip} from '../components/Tooltip/Tooltip'
import {useIsInsideTooltip} from '../components/Tooltip/TooltipContext'
import {tooltipDirectionPlacement, type TooltipDirection} from '../components/Tooltip/direction'
import {IconControlTooltipEscapeContext} from './IconControlTooltipContext'

interface IconControlTriggerProps {
  'aria-describedby'?: string
  'aria-labelledby'?: string
  id?: string
  ref?: React.Ref<HTMLElement>
}

interface IconControlTooltipProps {
  'aria-describedby'?: string
  'aria-labelledby'?: string
  children: React.ReactElement<IconControlTriggerProps>
  description?: string
  disabled?: boolean
  hasActivePopup?: boolean
  id?: string
  keybindingHint?: string | string[]
  label?: string
  tooltipDirection: TooltipDirection
  unsafeDisableTooltip: boolean
}

export const IconControlTooltip = React.forwardRef<HTMLElement, IconControlTooltipProps>(function IconControlTooltip(
  {
    'aria-describedby': describedBy,
    'aria-labelledby': labelledBy,
    children,
    description,
    disabled,
    hasActivePopup,
    id,
    keybindingHint,
    label,
    tooltipDirection,
    unsafeDisableTooltip,
  },
  ref,
) {
  const insideTooltip = useIsInsideTooltip()
  const passEscapeThrough = React.useContext(IconControlTooltipEscapeContext)
  if (unsafeDisableTooltip || insideTooltip || (!label && !description)) {
    return React.cloneElement(children, {'aria-describedby': describedBy, 'aria-labelledby': labelledBy, id, ref})
  }

  const placement = tooltipDirectionPlacement[tooltipDirection]
  return (
    <Tooltip.Root
      keybindingHint={keybindingHint}
      onOpenChange={(_, details) => {
        if (passEscapeThrough && details.reason === 'escape-key') details.allowPropagation()
      }}
      type={description ? 'description' : 'label'}
    >
      <Tooltip.Trigger
        ref={ref}
        id={id}
        aria-describedby={describedBy}
        aria-labelledby={labelledBy}
        disabled={disabled || hasActivePopup}
        render={children}
      />
      <Tooltip.Content align={placement.align} side={placement.side}>
        {description || label}
      </Tooltip.Content>
    </Tooltip.Root>
  )
})
