import React from 'react'
import InputValidation from '../_InputValidation'
import {SxProp} from '../sx'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {CheckboxOrRadioGroupContext} from './CheckboxOrRadioGroup'
import {Slot} from './slots'

export type CheckboxOrRadioGroupValidationProps = {
  /** Changes the visual style to match the validation status */
  variant: FormValidationStatus
} & SxProp

const CheckboxOrRadioGroupValidation: React.FC<CheckboxOrRadioGroupValidationProps> = ({children, variant, sx}) => (
  <Slot name="Validation">
    {({validationMessageId = ''}: CheckboxOrRadioGroupContext) => (
      <InputValidation validationStatus={variant} id={validationMessageId} sx={sx}>
        {children}
      </InputValidation>
    )}
  </Slot>
)

export default CheckboxOrRadioGroupValidation
