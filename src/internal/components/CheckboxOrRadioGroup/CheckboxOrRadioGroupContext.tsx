import React from 'react'
import {CheckboxOrRadioGroupProps} from './CheckboxOrRadioGroup'

export type CheckboxOrRadioGroupContext = {
  validationMessageId?: string
  captionId?: string
} & CheckboxOrRadioGroupProps

const CheckboxOrRadioGroupContext = React.createContext<CheckboxOrRadioGroupContext>({})

export default CheckboxOrRadioGroupContext
