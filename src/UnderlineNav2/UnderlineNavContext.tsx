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
  selectEvent: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement> | null
  afterSelect?: (event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void
  variant: 'default' | 'small'
  loadingCounters: boolean
  iconsVisible: boolean
  itemAs?: React.ElementType
}>({
  theme: {},
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  selectedLink: undefined,
  setSelectedLink: () => null,
  selectedLinkText: '',
  setSelectedLinkText: () => null,
  selectEvent: null,
  variant: 'default',
  loadingCounters: false,
  iconsVisible: true,
  itemAs: 'a',
})
