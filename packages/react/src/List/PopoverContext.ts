import {createContext, useContext} from 'react'

type PopoverContextValue = {
  popoverId: string
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopover(): PopoverContextValue {
  const context = useContext(PopoverContext)
  if (context) {
    return context
  }
  throw new Error('usePopover must be used within Popover.Root')
}

export {PopoverContext, usePopover}
