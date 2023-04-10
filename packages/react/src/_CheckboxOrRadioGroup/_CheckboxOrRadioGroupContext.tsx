import {createContext} from 'react'

const CheckboxOrRadioGroupContext = createContext<{
  disabled?: boolean
} | null>(null)

export default CheckboxOrRadioGroupContext
