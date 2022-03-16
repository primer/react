import React from 'react'
import {SxProp} from '../sx'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import InputValidation from '../_InputValidation'
import {FormControlContext} from './FormControl'
import {Slot} from './slots'

export type FormControlValidationProps = {
  variant: FormValidationStatus
  id?: string
} & SxProp

const FormControlValidation: React.FC<FormControlValidationProps> = ({children, variant, sx, id}) => (
  <Slot name="Validation">
    {({validationMessageId}: FormControlContext) => (
      <InputValidation validationStatus={variant} id={id || validationMessageId} sx={sx}>
        {children}
      </InputValidation>
    )}
  </Slot>
)

export default FormControlValidation
