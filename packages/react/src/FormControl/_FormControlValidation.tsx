import React from 'react'
import type {FC, PropsWithChildren} from 'react'
import InputValidation from '../internal/components/InputValidation'
import type {SxProp} from '../sx'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {useFormControlContext} from './_FormControlContext'

export type FormControlValidationProps = {
  /** Changes the visual style to match the validation status */
  variant: FormValidationStatus
  /** May be used to override the ID assigned by FormControl's React Context */
  id?: string
} & SxProp

/**
 * A message that provides feedback on the validation status of the field.
 * @alias FormControl.Validation
 * @primerparentid form_control
 */
const FormControlValidation: FC<PropsWithChildren<FormControlValidationProps>> = ({children, variant, sx, id}) => {
  const {validationMessageId} = useFormControlContext()
  return (
    <InputValidation validationStatus={variant} id={id || validationMessageId || ''} sx={sx}>
      {children}
    </InputValidation>
  )
}

export default FormControlValidation
