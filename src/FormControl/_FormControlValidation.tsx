import React from 'react'
import InputValidation from '../internal/components/_InputValidation'
import {SxProp} from '../sx'
import {FormValidationStatus} from '../internal/types/FormValidationStatus'
import {FormControlContext} from './FormControl'

export type FormControlValidationProps = {
  variant: FormValidationStatus
  id?: string
} & SxProp

const FormControlValidation: React.FC<React.PropsWithChildren<FormControlValidationProps>> = ({
  children,
  variant,
  sx,
  id,
}) => {
  const {validationMessageId} = React.useContext(FormControlContext)
  return (
    <InputValidation validationStatus={variant} id={id || validationMessageId || ''} sx={sx}>
      {children}
    </InputValidation>
  )
}

export default FormControlValidation
