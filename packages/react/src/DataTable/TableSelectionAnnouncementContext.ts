import {createContext} from 'react'

export function defaultSelectedCountLabel(selectedCount: number) {
  return `${selectedCount} selected`
}

// DataTable owns selection announcements, including when its toolbar is inactive.
// Standalone Table.BulkActions keeps its own announcement behavior.
export const TableSelectionAnnouncementContext = createContext(false)
