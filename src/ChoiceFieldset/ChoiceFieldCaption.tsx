import React, {useContext} from 'react'
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext'

const ChoiceFieldCaption: React.FC = ({children}) => {
  const choiceFieldsetListContext = useContext(ChoiceFieldsetListContext)
  if (choiceFieldsetListContext === null) {
    throw new Error('ChoiceFieldsetListContext returned null')
  }
  const {fieldComponent: FieldComponent} = choiceFieldsetListContext

  return <FieldComponent.Caption>{children}</FieldComponent.Caption>
}

export default ChoiceFieldCaption
