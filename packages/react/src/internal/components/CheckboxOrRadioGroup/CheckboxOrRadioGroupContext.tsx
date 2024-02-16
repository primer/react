import React from 'react'
import type {CheckboxOrRadioGroupProps} from './CheckboxOrRadioGroup'

export type CheckboxOrRadioGroupContext = {
  validationMessageId?: string
  captionId?: string
} & CheckboxOrRadioGroupProps

const CheckboxOrRadioGroupContext = React.createContext<CheckboxOrRadioGroupContext>({})

export default CheckboxOrRadioGroupContext
