import type {ChangeEventHandler} from 'react'
import {createContext} from 'react'

export const CheckboxGroupContext = createContext<{
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}>({})
