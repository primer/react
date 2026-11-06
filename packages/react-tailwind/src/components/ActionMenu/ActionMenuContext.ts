'use client'

import type {Menu} from '@base-ui/react/menu'
import React from 'react'

interface ActionMenuListContextValue {
  /** Whether consecutive items draw a divider between them. */
  showDividers: boolean
}

export const ActionMenuListContext = React.createContext<ActionMenuListContextValue>({showDividers: false})

/** Imperative actions of the menu that owns the current content, so its parts can close it. */
export const ActionMenuActionsContext = React.createContext<React.RefObject<Menu.Root.Actions | null> | null>(null)
