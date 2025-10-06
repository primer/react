import type React from 'react'
import {createContext} from 'react'

export const UnderlineNavContext = createContext<{
  setChildrenWidth: React.Dispatch<{text: string; width: number}>
  setNoIconChildrenWidth: React.Dispatch<{text: string; width: number}>
  loadingCounters: boolean
  iconsVisible: boolean
}>({
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  loadingCounters: false,
  iconsVisible: true,
})
