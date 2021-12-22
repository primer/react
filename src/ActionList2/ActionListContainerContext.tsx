/** This context can be used by components that compose ActionList inside a Menu */

import React from 'react'

type ContextProps = {
  container?: string
  listRole?: string
  itemRole?: string
  listLabelledBy?: string
  // This can be any function, we don't know anything about the arguments
  // to be more specific here, this is as good as (...args: any[]) => unknown
  // eslint-disable-next-line @typescript-eslint/ban-types
  afterSelect?: Function
}
export const ActionListContainerContext = React.createContext<ContextProps>({})
