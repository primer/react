import React from 'react'
import InputValidation from '../_InputValidation'
import {SxProp} from '../sx'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {ChoiceGroupContext} from './ChoiceGroup'
import {Slot} from './slots'

export type ChoiceGroupValidationProps = {
  /** Changes the visual style to match the validation status */
  variant: FormValidationStatus
} & SxProp

const ChoiceGroupValidation: React.FC<ChoiceGroupValidationProps> = ({children, variant, sx}) => (
  <Slot name="Validation">
    {({validationMessageId = ''}: ChoiceGroupContext) => (
      <InputValidation validationStatus={variant} id={validationMessageId} sx={sx}>
        {children}
      </InputValidation>
    )}
  </Slot>
)

export default ChoiceGroupValidation
