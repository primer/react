import {
  Box,
  FormControl as PrimerFormControl,
  type FormControlProps as PrimerFormControlProps,
  type FormControlCaptionProps as PrimerFormControlCaptionProps,
  type FormControlLabelProps as PrimerFormControlLabelProps,
  type FormControlValidationProps as PrimerFormControlValidationProps,
  type SxProp,
  sx,
} from '@primer/react'
import {forwardRef, type PropsWithChildren, type ComponentType} from 'react'
import styled from 'styled-components'

type FormControlProps = PrimerFormControlProps & SxProp

const FormControlImpl = forwardRef<HTMLDivElement, FormControlProps>(function FormControl(props, ref) {
  return <Box ref={ref} as={PrimerFormControl} {...props} />
})

type FormControlCaptionProps = PrimerFormControlCaptionProps & SxProp
type FormControlLabelProps = PropsWithChildren<PrimerFormControlLabelProps> & SxProp
type FormControlValidationProps = PropsWithChildren<PrimerFormControlValidationProps> & SxProp

const FormControlCaption: ComponentType<FormControlCaptionProps> = styled(
  PrimerFormControl.Caption,
).withConfig<FormControlCaptionProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const FormControlLeadingVisual: ComponentType<PropsWithChildren<{sx?: SxProp['sx']}>> = styled(
  PrimerFormControl.LeadingVisual,
).withConfig<{sx?: SxProp['sx']}>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const FormControlValidation: ComponentType<FormControlValidationProps> = styled(
  PrimerFormControl.Validation,
).withConfig<FormControlValidationProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const FormControlLabel: ComponentType<FormControlLabelProps> = styled(
  PrimerFormControl.Label,
).withConfig<FormControlLabelProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

type FormControlType = typeof FormControlImpl & {
  Caption: typeof FormControlCaption
  LeadingVisual: typeof FormControlLeadingVisual
  Validation: typeof FormControlValidation
  Label: typeof FormControlLabel
}

const FormControl: FormControlType = Object.assign(FormControlImpl, {
  Caption: FormControlCaption,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation,
  Label: FormControlLabel,
})

export {FormControl}
export type {FormControlProps}
