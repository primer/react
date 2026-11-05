'use client'

import React from 'react'

export type TooltipType = 'description' | 'label'

interface TooltipContextValue {
  hints: string[]
  id: string
  type: TooltipType
}

export const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined)

/** Whether the caller renders inside a Tooltip, so it should not add a nested tooltip. */
export const useIsInsideTooltip = () => React.useContext(TooltipContext) !== undefined
