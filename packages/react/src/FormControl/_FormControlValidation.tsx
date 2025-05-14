import type React from 'react'
import InputValidation from '../internal/components/InputValidation'
import type {SxProp} from '../sx'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {useFormControlContext} from './_FormControlContext'

export type FormControlValidationProps = {
  variant: FormValidationStatus
  id?: string
  className?: string
} & SxProp

const FormControlValidation: React.FC<React.PropsWithChildren<FormControlValidationProps>> = ({
  children,
  className,
  variant,
  sx,
  id,
}) => {
  const {validationMessageId} = useFormControlContext()
  return (
    <InputValidation className={className} validationStatus={variant} id={id || validationMessageId || ''} sx={sx}>
      {children}
    </InputValidation>
  )
}

export default FormControlValidation
