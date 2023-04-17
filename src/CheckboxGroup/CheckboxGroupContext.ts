import {ChangeEventHandler, createContext} from 'react'

export const CheckboxGroupContext = createContext<{
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}>({})
