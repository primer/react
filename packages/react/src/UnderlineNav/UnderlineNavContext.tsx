import {createContext} from 'react'
import type {UnderlineNavItemProps} from './UnderlineNavItem'

export const UnderlineNavContext = createContext<{
  loadingCounters: boolean
  registerItem: (id: string, props: UnderlineNavItemProps | null) => void
  unregisterItem: (id: string) => void
}>({
  loadingCounters: false,
  registerItem: () => {},
  unregisterItem: () => {},
})
