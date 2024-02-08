import React from 'react'
import InputValidation from '../InputValidation'
import type {SxProp} from '../../../sx'
import type {FormValidationStatus} from '../../../utils/types/FormValidationStatus'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'

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
