import {
  Box,
  FormControl as PrimerFormControl,
  type FormControlProps as PrimerFormControlProps,
  type SxProp,
} from '@primer/react'
import {forwardRef, type PropsWithChildren} from 'react'

type FormControlProps = PropsWithChildren<PrimerFormControlProps> & SxProp

const FormControlImpl = forwardRef<HTMLDivElement, FormControlProps>(function FormControl(props, ref) {
  return <Box ref={ref} as={PrimerFormControl} {...props} />
})

const FormControl = Object.assign(FormControlImpl, {
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
