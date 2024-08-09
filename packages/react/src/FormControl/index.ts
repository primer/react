import {FormControl as FormControlImpl} from './FormControl'
import type {FormControlProps} from './FormControl'
import FormControlCaption from './_FormControlCaption'
import FormControlLabel from './_FormControlLabel'
import FormControlLeadingVisual from './_FormControlLeadingVisual'
import FormControlValidation from './_FormControlValidation'
import {useFormControlForwardedProps} from './_FormControlContext'

export const FormControl = Object.assign(FormControlImpl, {
  Caption: FormControlCaption,
  Label: FormControlLabel,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation,
})
export {useFormControlForwardedProps}

export type {FormControlProps}
