import {ChangeEventHandler, createContext} from 'react'

const ChoiceFieldsetListContext = createContext<{
  initialSelectedChoices?: string[]
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  selectionVariant?: 'multiple' | 'single'
}>({})

export default ChoiceFieldsetListContext
