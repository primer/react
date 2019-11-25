import React, {createContext} from 'react'

export const MenuContext = createContext()

export const ContextProvider = ({value, children}) => {
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
