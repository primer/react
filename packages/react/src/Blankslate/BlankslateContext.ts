import {createContext, useContext} from 'react'

type BlankslateContextType = {
  size: 'small' | 'medium' | 'large'
}

const BlankslateContext = createContext<BlankslateContextType | null>(null)

function useBlankslate(): BlankslateContextType {
  const context = useContext(BlankslateContext)
  if (!context) {
    throw new Error('useBlankslate must be used within a BlankslateProvider')
  }
  return context
}

const Provider = BlankslateContext.Provider

export {Provider, useBlankslate}
