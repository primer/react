import type React from 'react'
import InputValidation from '../internal/components/InputValidation'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {useFormControlContext} from './_FormControlContext'
import type {FCWithSlotMarker} from '../utils/types'

export type FormControlValidationProps = {
  variant: FormValidationStatus
  id?: string
  className?: string
  style?: React.CSSProperties
}

const FormControlValidation: FCWithSlotMarker<React.PropsWithChildren<FormControlValidationProps>> = ({
  children,
  className,
  variant,
  id,
  style,
}) => {
  const {validationMessageId} = useFormControlContext()
  return (
    <InputValidation
      className={className}
      validationStatus={variant}
      id={id || validationMessageId || ''}
      style={style}
    >
      {children}
    </InputValidation>
  )
}

FormControlValidation.__SLOT__ = Symbol('FormControl.Validation')

export default FormControlValidation
