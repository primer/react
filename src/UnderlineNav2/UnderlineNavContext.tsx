import React, {createContext, RefObject} from 'react'

export const UnderlineNavContext = createContext<{
  setChildrenWidth: React.Dispatch<{text: string; width: number}>
  setNoIconChildrenWidth: React.Dispatch<{text: string; width: number}>
  selectedLink: RefObject<HTMLElement> | undefined
  setSelectedLink: (ref: RefObject<HTMLElement>) => void
  selectedLinkText: string
  setSelectedLinkText: React.Dispatch<React.SetStateAction<string>>
  selectEvent: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement> | null
  afterSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  variant: 'default' | 'small'
  loadingCounters: boolean
  iconsVisible: boolean
}>({
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  selectedLink: undefined,
  setSelectedLink: () => null,
  selectedLinkText: '',
  setSelectedLinkText: () => null,
  selectEvent: null,
  variant: 'default',
  loadingCounters: false,
  iconsVisible: true
})
