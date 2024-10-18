import {createContext} from 'react'

export const LabelGroupContext = createContext<{
  isList?: boolean
}>({})
