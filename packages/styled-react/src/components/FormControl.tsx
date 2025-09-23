import {
  Box,
  FormControl as PrimerFormControl,
  type FormControlProps as PrimerFormControlProps,
  type FormControlCaptionProps,
  type FormControlValidationProps as PrimerFormControlValidationProps,
  type SxProp,
} from '@primer/react'
import {forwardRef, type PropsWithChildren} from 'react'

type FormControlProps = PropsWithChildren<PrimerFormControlProps> & SxProp

const FormControlImpl = forwardRef<HTMLDivElement, FormControlProps>(function FormControl(props, ref) {
  return <Box ref={ref} as={PrimerFormControl} {...props} />
})

const FormControlCaption = function (props: FormControlCaptionProps) {
  return <Box as={PrimerFormControl.Caption} {...props} />
}

type FormControlValidationProps = PropsWithChildren<PrimerFormControlValidationProps> & SxProp

const FormControlValidation = function (props: FormControlValidationProps) {
  return <Box as={PrimerFormControl.Validation} {...props} />
}

const FormControl = Object.assign(FormControlImpl, {
  Caption: FormControlCaption,
  LeadingVisual: PrimerFormControl.LeadingVisual,
  Validation: FormControlValidation,
  Label: PrimerFormControl.Label,
}) as typeof FormControlImpl & {
  Caption: typeof FormControlCaption
  LeadingVisual: typeof PrimerFormControl.LeadingVisual
  Validation: typeof FormControlValidation
  Label: typeof PrimerFormControl.Label
}

export {FormControl}
export type {FormControlProps}
