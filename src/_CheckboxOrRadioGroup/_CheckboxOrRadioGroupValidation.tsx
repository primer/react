import React, {useContext} from 'react'
import InputValidation from '../_InputValidation'
import {SxProp} from '../sx'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {Slot} from './slots'
import CheckboxOrRadioGroupContext from './_CheckboxOrRadioGroupContext'

export type CheckboxOrRadioGroupValidationProps = {
  /** Changes the visual style to match the validation status */
  variant: FormValidationStatus
} & SxProp

const CheckboxOrRadioGroupValidation: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupValidationProps>> = ({
  children,
  variant,
  sx
}) => {
  const {validationMessageId = ''} = useContext(CheckboxOrRadioGroupContext) ?? {}

  return (
    <Slot name="Validation">
      <InputValidation validationStatus={variant} id={validationMessageId} sx={sx}>
        {children}
      </InputValidation>
    </Slot>
  )
}

export default CheckboxOrRadioGroupValidation
