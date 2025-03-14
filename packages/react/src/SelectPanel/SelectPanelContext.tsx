import React from 'react'

export type SelectPanelStatus = 'error' | 'warning' | 'empty' | 'no-results' | undefined

export const SelectPanelContext = React.createContext<{
  status: SelectPanelStatus
}>({status: undefined})

export default SelectPanelContext
