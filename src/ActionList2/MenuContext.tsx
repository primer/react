/** This context can be used by components that compose ActionList inside a Menu */

import React from 'react'

type ContextProps = {parent?: string; listRole?: string; itemRole?: string; afterSelect?: () => void}
export const MenuContext = React.createContext<ContextProps>({})
