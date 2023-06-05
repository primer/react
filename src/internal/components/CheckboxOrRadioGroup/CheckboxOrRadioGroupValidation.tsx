import React from 'react'
import InputValidation from '../InputValidation'
import {SxProp} from '../../../sx'
import {FormValidationStatus} from '../../../utils/types/FormValidationStatus'
import {CheckboxOrRadioGroupContext} from './CheckboxOrRadioGroup'

export type CheckboxOrRadioGroupValidationProps = {
  /** Changes the visual style to match the validation status */
  variant: FormValidationStatus
} & SxProp

const CheckboxOrRadioGroupValidation: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupValidationProps>> = ({
  children,
  variant,
  sx,
}) => {
  const {validationMessageId = ''} = React.useContext(CheckboxOrRadioGroupContext)
  return (
    <InputValidation validationStatus={variant} id={validationMessageId} sx={sx}>
      {children}
    </InputValidation>
  )
}

export default CheckboxOrRadioGroupValidation
