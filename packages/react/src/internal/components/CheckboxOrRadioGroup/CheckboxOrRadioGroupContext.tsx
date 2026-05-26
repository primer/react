import React from 'react'
import type {CheckboxOrRadioGroupProps} from './CheckboxOrRadioGroup'

export type CheckboxOrRadioGroupContext = {
  validationMessageId?: string
  captionId?: string
  parentName?: string
} & CheckboxOrRadioGroupProps

const CheckboxOrRadioGroupContext = React.createContext<CheckboxOrRadioGroupContext>({})

export default CheckboxOrRadioGroupContext
