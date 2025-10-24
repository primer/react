import {Checkbox as PrimerCheckbox, type CheckboxProps as PrimerCheckboxProps, type SlotMarker} from '@primer/react'
import {Box} from './Box'
import {forwardRef} from 'react'
import {type SxProp} from '../sx'

export type CheckboxProps = PrimerCheckboxProps & SxProp

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <Box {...props} as={PrimerCheckbox} ref={ref} />
})
;(Checkbox as typeof Checkbox & SlotMarker).__SLOT__ = PrimerCheckbox.__SLOT__
