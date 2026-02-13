import {createContext} from 'react'

export const UnderlineNavContext = createContext<{
  loadingCounters: boolean
  iconsVisible: boolean
}>({
  loadingCounters: false,
  iconsVisible: true,
})
