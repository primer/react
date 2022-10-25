import React, {createContext, RefObject} from 'react'
import {Theme} from '../ThemeProvider'

export const UnderlineNavContext = createContext<{
  theme: Theme | undefined
  setChildrenWidth: React.Dispatch<{text: string; width: number}>
  setNoIconChildrenWidth: React.Dispatch<{text: string; width: number}>
  selectedLink: RefObject<HTMLElement> | undefined
  setSelectedLink: (ref: RefObject<HTMLElement>) => void
  selectedLinkText: string
  setSelectedLinkText: React.Dispatch<React.SetStateAction<string>>
  selectEvent: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement> | null
  setAsNavItem: React.Dispatch<React.SetStateAction<string>>
  afterSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  variant: 'default' | 'small'
  loadingCounters: boolean
  iconsVisible: boolean
}>({
  theme: {},
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  selectedLink: undefined,
  setSelectedLink: () => null,
  selectedLinkText: '',
  setSelectedLinkText: () => null,
  selectEvent: null,
  setAsNavItem: () => null,
  variant: 'default',
  loadingCounters: false,
  iconsVisible: true
})
