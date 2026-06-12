import {type ChangeEventHandler, createContext} from 'react'

export const RadioGroupContext = createContext<{
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  name: string
} | null>(null)
