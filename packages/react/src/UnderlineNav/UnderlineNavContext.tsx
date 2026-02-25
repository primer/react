import {createContext} from 'react'

export const UnderlineNavContext = createContext<{
  loadingCounters: boolean
}>({
  loadingCounters: false,
})
