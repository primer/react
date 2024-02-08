import React from 'react'
import InputValidation from '../internal/components/InputValidation'
import {SxProp} from '../sx'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {useFormControlContext} from './_FormControlContext'

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
  const {validationMessageId} = useFormControlContext()
  return (
    <InputValidation validationStatus={variant} id={id || validationMessageId || ''} sx={sx}>
      {children}
    </InputValidation>
  )
}

export default FormControlValidation
