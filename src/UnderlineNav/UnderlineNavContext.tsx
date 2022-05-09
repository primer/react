import React, {createContext} from 'react'

export const UnderlineNavContext = createContext<{
  childSize: {width: number}
  setChildSize: React.Dispatch<{width: number}>
}>({
  childSize: {width: 0},
  setChildSize: () => null
})
