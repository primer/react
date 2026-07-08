import {createContext} from 'react'
import type {TabsContextValue} from './types'

export const TabsContext = createContext<TabsContextValue | null>(null)
