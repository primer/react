import React from 'react'
import InputValidation from '../InputValidation'
import {InputFieldContext} from './InputField'
import {Slot} from './slots'

const InputFieldValidation: React.FC = ({children}) => (
  <Slot name="Validation">
    {({validationStatus, validationMessageId}: InputFieldContext) => (
      <InputValidation validationStatus={validationStatus} id={validationMessageId}>
        {children}
      </InputValidation>
    )}
  </Slot>
)

export default InputFieldValidation
