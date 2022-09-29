import React, {createContext, RefObject} from 'react'

export const UnderlineNavContext = createContext<{
  setChildrenWidth: React.Dispatch<{width: number}>
  setNoIconChildrenWidth: React.Dispatch<{width: number}>
  selectedLink: RefObject<HTMLElement> | undefined
  setSelectedLink: (ref: RefObject<HTMLElement>) => void
  afterSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  variant: 'default' | 'small'
  loadingCounters: boolean
  iconsVisible: boolean
}>({
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  selectedLink: undefined,
  setSelectedLink: () => null,
  variant: 'default',
  loadingCounters: false,
  iconsVisible: true
})
