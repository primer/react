import React from 'react'
export interface InputFieldValidationProps {
  validationKey: string
}

const InputFieldValidation: React.FC<InputFieldValidationProps> = ({children}) => <>{children}</>

export default InputFieldValidation
