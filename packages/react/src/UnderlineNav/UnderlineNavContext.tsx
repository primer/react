import type React from 'react'
import {createContext} from 'react'
import type {Theme} from '../ThemeProvider'

export const UnderlineNavContext = createContext<{
  theme: Theme | undefined
  setChildrenWidth: React.Dispatch<{text: string; width: number}>
  setNoIconChildrenWidth: React.Dispatch<{text: string; width: number}>
  loadingCounters: boolean
  iconsVisible: boolean
}>({
  theme: {},
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  loadingCounters: false,
  iconsVisible: true,
})
