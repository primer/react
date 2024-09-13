/** This context can be used by components that compose ActionList inside a Menu */

import React from 'react'
import type {AriaRole} from '../utils/types'

type ContextProps = {
  container?: string
  listRole?: AriaRole
  selectionVariant?: 'single' | 'multiple'
  selectionAttribute?: 'aria-selected' | 'aria-checked'
  listLabelledBy?: string
  // This can be any function, we don't know anything about the arguments
  // to be more specific here, this is as good as (...args: any[]) => unknown
  // eslint-disable-next-line @typescript-eslint/ban-types
  afterSelect?: Function
  enableFocusZone?: boolean
  defaultTrailingVisual?: React.ReactElement
}

export const ActionListContainerContext = React.createContext<ContextProps>({})
