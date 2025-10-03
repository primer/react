import type React from 'react'
import InputValidation from '../internal/components/InputValidation'
import type {SxProp} from '../sx'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {useFormControlContext} from './_FormControlContext'

export type FormControlValidationProps = {
  variant: FormValidationStatus
  id?: string
  className?: string
  style?: React.CSSProperties
} & SxProp

const FormControlValidation: React.FC<React.PropsWithChildren<FormControlValidationProps>> = ({
  children,
  className,
  variant,
  sx,
  id,
  style,
}) => {
  const {validationMessageId} = useFormControlContext()
  return (
    <InputValidation
      className={className}
      validationStatus={variant}
      id={id || validationMessageId || ''}
      sx={sx}
      style={style}
    >
      {children}
    </InputValidation>
  )
}

export default FormControlValidation
