import {createContext} from 'react'

export function defaultSelectedCountLabel(selectedCount: number) {
  return `${selectedCount} selected`
}

export const TableSelectionAnnouncementContext = createContext(false)
