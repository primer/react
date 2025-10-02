import {
  Box,
  FormControl as PrimerFormControl,
  type FormControlProps as PrimerFormControlProps,
  type FormControlCaptionProps as PrimerFormControlCaptionProps,
  type FormControlValidationProps as PrimerFormControlValidationProps,
  type FormControlLabelProps as PrimerFormControlLabelProps,
  type SxProp,
} from '@primer/react'
import {forwardRef, type PropsWithChildren} from 'react'

type FormControlProps = PropsWithChildren<PrimerFormControlProps> & SxProp

const FormControlImpl = forwardRef<HTMLDivElement, FormControlProps>(function FormControl(props, ref) {
  return <Box ref={ref} as={PrimerFormControl} {...props} />
})

type FormControlCaptionProps = PropsWithChildren<PrimerFormControlCaptionProps> & SxProp
const FormControlCaption = (props: FormControlCaptionProps) => {
  return <Box as={PrimerFormControl.Caption} {...props} />
}

type FormControlValidationProps = PropsWithChildren<PrimerFormControlValidationProps> & SxProp

const FormControlValidation = (props: FormControlValidationProps) => {
  return <Box as={PrimerFormControl.Validation} {...props} />
}

const FormControlLeadingVisual = (props: PropsWithChildren<SxProp>) => {
  return <Box as={PrimerFormControl.LeadingVisual} {...props} />
}

type FormControlLabelProps = PropsWithChildren<PrimerFormControlLabelProps> & SxProp

const FormControlLabel = (props: FormControlLabelProps) => {
  return <Box as={PrimerFormControl.Label} {...props} />
}

const FormControl = Object.assign(FormControlImpl, {
  Caption: FormControlCaption,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation,
  Label: FormControlLabel,
}) as typeof FormControlImpl & {
  Caption: typeof FormControlCaption
  LeadingVisual: typeof FormControlLeadingVisual
  Validation: typeof FormControlValidation
  Label: typeof FormControlLabel
}

export {FormControl, type FormControlProps}
