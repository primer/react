import {ChangeEventHandler, createContext} from 'react'

const ChoiceFieldsetListContext = createContext<{
  disabled?: boolean
  name: string
  onChange: ChangeEventHandler<HTMLInputElement>
  selected?: string[]
  selectionVariant?: 'single' | 'multiple'
} | null>(null)

export default ChoiceFieldsetListContext
