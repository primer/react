import {createContext, useContext} from 'react'
import type {UseBasePopoverReturn} from './useBasePopover'

type BasePopoverContextValue = UseBasePopoverReturn

const BasePopoverContext = createContext<BasePopoverContextValue | null>(null)

function useBasePopoverContext(): BasePopoverContextValue {
  const context = useContext(BasePopoverContext)
  if (context) {
    return context
  }
  throw new Error('useBasePopover must be used within a BasePopoverContext.Provider')
}

export {BasePopoverContext, useBasePopoverContext}
export type {BasePopoverContextValue}
