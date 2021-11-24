import React, {useContext} from 'react'
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext'

export interface ChoiceFieldInputProps {
  /**
   * The value that is being toggled on
   */
  value: string
  /**
   * Whether the input is toggled on
   */
  checked?: boolean
}

const ChoiceFieldInput: React.FC<ChoiceFieldInputProps> = ({checked, value}) => {
  const choiceFieldsetListContext = useContext(ChoiceFieldsetListContext)
  if (choiceFieldsetListContext === null) {
    throw new Error('ChoiceFieldsetListContext returned null')
  }
  const {name, onChange, fieldComponent: FieldComponent} = choiceFieldsetListContext

  return <FieldComponent.Input checked={checked} value={value} name={name} onChange={onChange} />
}

export default ChoiceFieldInput
