import {
  CheckboxGroupCaption,
  CheckboxGroup as CheckboxGroupImpl,
  CheckboxGroupLabel,
  CheckboxGroupValidation,
} from './CheckboxGroup'
import {CheckboxGroupContext} from './CheckboxGroupContext'

export const CheckboxGroup = Object.assign(CheckboxGroupImpl, {
  Caption: CheckboxGroupCaption,
  Label: CheckboxGroupLabel,
  Validation: CheckboxGroupValidation,
})

export {CheckboxGroupContext}
