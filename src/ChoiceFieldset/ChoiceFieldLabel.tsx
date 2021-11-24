import React, {useContext} from 'react'
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext'

const ChoiceFieldLabel: React.FC = ({children}) => {
  const choiceFieldsetListContext = useContext(ChoiceFieldsetListContext)
  if (choiceFieldsetListContext === null) {
    throw new Error('ChoiceFieldsetListContext returned null')
  }
  const {fieldComponent: FieldComponent} = choiceFieldsetListContext

  return <FieldComponent.Label>{children}</FieldComponent.Label>
}

export default ChoiceFieldLabel
