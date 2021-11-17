import {ChangeEventHandler, createContext} from 'react'

const ChoiceFieldsetListContext = createContext<{
  initialSelectedChoices?: string[]
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  selectionVariant?: 'multiple' | 'single'
  validationStatus?: 'error' | 'warning' | 'success'
}>({})

export default ChoiceFieldsetListContext
