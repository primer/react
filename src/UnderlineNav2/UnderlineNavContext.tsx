import React, {createContext} from 'react'

export const UnderlineNavContext = createContext<{
  setChildrenWidth: React.Dispatch<{width: number}>
}>({
  setChildrenWidth: () => null
})
