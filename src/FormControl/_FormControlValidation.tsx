import React from 'react'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {Slot} from './slots'

export interface FormControlValidationProps {
  appearance: FormValidationStatus
}

const FormControlValidation: React.FC<FormControlValidationProps> = ({children}) => (
  <Slot name="Validation">{children}</Slot>
)

export default FormControlValidation
