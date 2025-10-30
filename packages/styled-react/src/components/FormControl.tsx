import {FormControl as PrimerFormControl, type FormControlProps as PrimerFormControlProps} from '@primer/react'
import {type PropsWithChildren} from 'react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'

type FormControlProps = PropsWithChildren<PrimerFormControlProps> & SxProp

const FormControlImpl: React.ComponentType<FormControlProps> = styled(PrimerFormControl).withConfig({
  shouldForwardProp: prop => (prop as keyof FormControlProps) !== 'sx',
})<FormControlProps>`
  ${sx}
`

const FormControl = Object.assign(FormControlImpl, {
  __SLOT__: PrimerFormControl.__SLOT__,
  Caption: PrimerFormControl.Caption,
  LeadingVisual: PrimerFormControl.LeadingVisual,
  Validation: PrimerFormControl.Validation,
  Label: PrimerFormControl.Label,
}) as typeof FormControlImpl & {
  Caption: typeof PrimerFormControl.Caption
  LeadingVisual: typeof PrimerFormControl.LeadingVisual
  Validation: typeof PrimerFormControl.Validation
  Label: typeof PrimerFormControl.Label
}

export {FormControl, type FormControlProps}
