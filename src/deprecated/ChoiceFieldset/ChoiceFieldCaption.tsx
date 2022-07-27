import React from 'react'
import ChoiceInputField from '../ChoiceInputField'

const ChoiceFieldCaption: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <ChoiceInputField.Caption>{children}</ChoiceInputField.Caption>
)

export default ChoiceFieldCaption
