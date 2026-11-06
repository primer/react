'use client'

import React from 'react'

export type TooltipType = 'description' | 'label'

/** Named open delays shared with Primer React: `short` (50ms), `medium` (400ms) and `long` (1200ms). */
export type TooltipDelay = 'short' | 'medium' | 'long'

export const tooltipDelayMs: Record<TooltipDelay, number> = {short: 50, medium: 400, long: 1200}

interface TooltipContextValue {
  delay?: TooltipDelay
  disabled?: boolean
  hints: string[]
  id: string
  type: TooltipType
}

/** Whether a `Tooltip.Provider` supplies the open delay, so triggers should defer to it. */
export const TooltipProviderContext = React.createContext(false)

export const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined)

/** Whether the caller renders inside a Tooltip, so it should not add a nested tooltip. */
export const useIsInsideTooltip = () => React.useContext(TooltipContext) !== undefined
