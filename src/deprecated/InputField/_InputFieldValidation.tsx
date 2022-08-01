import React from 'react'
export interface InputFieldValidationProps {
  validationKey: string
}

const InputFieldValidation: React.FC<React.PropsWithChildren<InputFieldValidationProps>> = ({children}) => (
  <>{children}</>
)

export default InputFieldValidation
