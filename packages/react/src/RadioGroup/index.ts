import {RadioGroup as RadioGroupImpl, RadioGroupCaption, RadioGroupLabel, RadioGroupValidation} from './RadioGroup'
export {RadioGroupContext} from './RadioGroup'

export const RadioGroup = Object.assign(RadioGroupImpl, {
  Caption: RadioGroupCaption,
  Label: RadioGroupLabel,
  Validation: RadioGroupValidation,
})
