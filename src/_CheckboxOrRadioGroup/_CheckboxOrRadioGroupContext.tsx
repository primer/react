import {createContext} from 'react'
import {CheckboxOrRadioGroupProps} from './CheckboxOrRadioGroup'

type CheckboxOrRadioGroupContext = {
  validationMessageId?: string
  captionId?: string
} & CheckboxOrRadioGroupProps

const CheckboxOrRadioGroupContext = createContext<CheckboxOrRadioGroupContext | null>(null)

export default CheckboxOrRadioGroupContext
