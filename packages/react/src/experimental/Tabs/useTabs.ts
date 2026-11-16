import {useContext} from 'react'
import {TabsContext} from './TabsContext'
import type {TabsContextValue} from './types'

export function useTabs(): TabsContextValue {
  const context = useContext(TabsContext)
  if (context) {
    return context
  }
  throw new Error('Component must be used within a <Tabs> component')
}
