import {createContext, useContext} from 'react'

type BlankslateContextType = {
  size: 'small' | 'medium' | 'large'
}

const BlankslateContext = createContext<BlankslateContextType>({
  size: 'medium',
})

function useBlankslate(): BlankslateContextType {
  return useContext(BlankslateContext)
}

const Provider = BlankslateContext.Provider

export {Provider, useBlankslate}
