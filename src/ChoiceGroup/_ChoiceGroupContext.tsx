import {createContext} from 'react'

const ChoiceGroupContext = createContext<{
  disabled?: boolean
} | null>(null)

export default ChoiceGroupContext
