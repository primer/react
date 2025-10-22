import React from 'react'
import InputValidation from '../InputValidation'
import type {FormValidationStatus} from '../../../utils/types/FormValidationStatus'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'
import type {FCWithSlotMarker} from '../../../utils/types'

export type CheckboxOrRadioGroupValidationProps = {
  /** Changes the visual style to match the validation status */
  variant: FormValidationStatus
}

const CheckboxOrRadioGroupValidation: FCWithSlotMarker<
  React.PropsWithChildren<CheckboxOrRadioGroupValidationProps>
> = ({children, variant}) => {
  const {validationMessageId = ''} = React.useContext(CheckboxOrRadioGroupContext)
  return (
    <InputValidation validationStatus={variant} id={validationMessageId}>
      {children}
    </InputValidation>
  )
}

export default CheckboxOrRadioGroupValidation

CheckboxOrRadioGroupValidation.__SLOT__ = Symbol('CheckboxOrRadioGroupValidation')
