import React from 'react'
import {SxProp} from '../sx'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import InputValidation from '../_InputValidation'
import {Slot} from './slots'
import {FormControlContext} from './_FormControlContext'

export type FormControlValidationProps = {
  variant: FormValidationStatus
  id?: string
} & SxProp

const FormControlValidation: React.FC<React.PropsWithChildren<FormControlValidationProps>> = ({
  children,
  variant,
  sx,
  id
}) => {
  const {validationMessageId} = React.useContext(FormControlContext) ?? {}
  return (
    <Slot name="Validation">
      <InputValidation validationStatus={variant} id={(id || validationMessageId) ?? ''} sx={sx}>
        {children}
      </InputValidation>
    </Slot>
  )
}

export default FormControlValidation
