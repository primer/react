import React, {createContext} from 'react'
import {Theme} from '../ThemeProvider'

export const UnderlineNavContext = createContext<{
  theme: Theme | undefined
  setChildrenWidth: React.Dispatch<{text: string; width: number}>
  setNoIconChildrenWidth: React.Dispatch<{text: string; width: number}>
  selectedLinkText: string
  setSelectedLinkText: React.Dispatch<React.SetStateAction<string>>
  selectEvent: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement> | null
  afterSelect?: (event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void
  variant: 'default' | 'small'
  loadingCounters: boolean
  iconsVisible: boolean
}>({
  theme: {},
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  selectedLinkText: '',
  setSelectedLinkText: () => null,
  selectEvent: null,
  variant: 'default',
  loadingCounters: false,
  iconsVisible: true,
})
