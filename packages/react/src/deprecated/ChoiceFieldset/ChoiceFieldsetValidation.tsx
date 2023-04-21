import React from 'react'

export interface ChoiceFieldsetValidationProps {
  validationKey: string
}

const ChoiceFieldsetValidation: React.FC<React.PropsWithChildren<ChoiceFieldsetValidationProps>> = ({children}) => (
  <>{children}</>
)

export default ChoiceFieldsetValidation
