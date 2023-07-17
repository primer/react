import React, {createContext, RefObject} from 'react'
import {Theme} from '../ThemeProvider'

export const UnderlineNavContext = createContext<{
  theme: Theme | undefined
  setChildrenWidth: React.Dispatch<{text: string; width: number}>
  setNoIconChildrenWidth: React.Dispatch<{text: string; width: number}>
  currentItem: RefObject<HTMLElement> | undefined
  setCurrentItem: (ref: RefObject<HTMLElement>) => void
  loadingCounters: boolean
  iconsVisible: boolean
  actionSwapKey: string | undefined
  setActionSwapKey: React.Dispatch<string | undefined>
}>({
  theme: {},
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  currentItem: undefined,
  setCurrentItem: () => null,
  loadingCounters: false,
  iconsVisible: true,
  actionSwapKey: undefined,
  setActionSwapKey: () => null,
})
