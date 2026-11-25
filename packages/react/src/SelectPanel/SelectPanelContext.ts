import React from 'react'
import type {SelectPanelState} from './useSelectPanel'

type SelectPanelShellState = Omit<SelectPanelState<never>, 'selected' | 'selectItem' | 'isSelected'>

export const SelectPanelContext = React.createContext<SelectPanelShellState | null>(null)
export const ParentPanelContext = React.createContext<SelectPanelShellState | null>(null)
export const SelectPanelDialogContext = React.createContext(false)
export const SelectPanelSelectionContext = React.createContext<Pick<
  SelectPanelState,
  'selected' | 'selectItem' | 'isSelected'
> | null>(null)

export function useSelectPanelContext() {
  const context = React.useContext(SelectPanelContext)
  if (context === null) {
    throw new Error('SelectPanel parts must be rendered inside SelectPanel.Root.')
  }
  return context
}

export function useSelectPanelSelection() {
  const context = React.useContext(SelectPanelSelectionContext)
  if (context === null) {
    throw new Error('SelectPanel items and rows must be rendered inside SelectPanel.Root.')
  }
  return context
}
