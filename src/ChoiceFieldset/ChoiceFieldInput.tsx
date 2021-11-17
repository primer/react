import React, {HTMLProps, useContext} from 'react'
import InputField from '../InputField'
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext'

export interface ChoiceFieldInputProps {
  /**
   * The value that is being toggled on
   */
  value: string
  // TODO: probably change to `selected` or whatever `ActionList.Item` uses for selection
  /**
   * Whether the input is toggled on
   */
  checked?: boolean
}

// TODO: replace with the Primer's checkbox input once it's created
const CheckboxInput: React.FC<HTMLProps<HTMLInputElement>> = props => {
  return <input type="checkbox" {...props} />
}

// TODO: replace with the Primer's checkbox input once it's created
const RadioInput: React.FC<HTMLProps<HTMLInputElement>> = props => {
  return <input type="radio" {...props} />
}

const ChoiceFieldInput: React.FC<ChoiceFieldInputProps> = ({checked, value}) => {
  const {name, onChange, selectionVariant} = useContext(ChoiceFieldsetListContext)

  return (
    <InputField.Input
      checked={checked}
      value={value}
      name={name}
      onChange={onChange}
      as={selectionVariant === 'multiple' ? CheckboxInput : RadioInput}
    />
  )
}

export default ChoiceFieldInput
