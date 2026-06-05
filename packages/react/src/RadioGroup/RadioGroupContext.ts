import type {ChangeEventHandler} from 'react'
import {createContext} from 'react'

export const RadioGroupContext = createContext<{
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  name: string
} | null>(null)
