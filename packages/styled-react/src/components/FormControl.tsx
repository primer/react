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
import type {ForwardRefComponent} from '../polymorphic'

type FormControlProps = PrimerFormControlProps & SxProp

const FormControlImpl = forwardRef<HTMLDivElement, FormControlProps>(function FormControl(props, ref) {
  return <Box ref={ref} as={PrimerFormControl} {...props} />
})

type FormControlCaptionProps = PrimerFormControlCaptionProps & SxProp
type FormControlValidationProps = PropsWithChildren<PrimerFormControlValidationProps> & SxProp

const FormControlCaption: ComponentType<FormControlCaptionProps> = styled(
  PrimerFormControl.Caption,
).withConfig<FormControlCaptionProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const FormControlValidation = styled(PrimerFormControl.Validation).withConfig<FormControlValidationProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

type BaseProps = SxProp & {
  disabled?: boolean
  required?: boolean
  requiredText?: string
  requiredIndicator?: boolean
  visuallyHidden?: boolean
  id?: string
  className?: string
}

export type LabelProps = BaseProps & {
  htmlFor?: string
  as?: 'label'
}

type InputLabelProps = PropsWithChildren<LabelProps>

type FormControlLabelProps = PropsWithChildren<{htmlFor?: string} & InputLabelProps & PrimerFormControlLabelProps> &
  SxProp

const FormControlLabel: ForwardRefComponent<'label', FormControlLabelProps> = styled(
  PrimerFormControl.Label,
).withConfig<FormControlLabelProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const FormControl = Object.assign(FormControlImpl, {
  Caption: FormControlCaption,
  LeadingVisual: PrimerFormControl.LeadingVisual,
  Validation: FormControlValidation,
  Label: FormControlLabel,
})

export {FormControl}
export type {FormControlProps}
