import React from 'react'
import ChoiceInputField from '../ChoiceInputField'

const ChoiceFieldLabel: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <ChoiceInputField.Label>{children}</ChoiceInputField.Label>
)

export default ChoiceFieldLabel
