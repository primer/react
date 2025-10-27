/* eslint-disable primer-react/spread-props-first */
import {Checkbox as PrimerCheckbox, type CheckboxProps as PrimerCheckboxProps, type SlotMarker} from '@primer/react'
import {Box} from './Box'
import {forwardRef} from 'react'
import {type SxProp} from '../sx'

export type CheckboxProps = PrimerCheckboxProps & SxProp

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <Box as={PrimerCheckbox} ref={ref} {...props} />
})
;(Checkbox as typeof Checkbox & SlotMarker).__SLOT__ = PrimerCheckbox.__SLOT__
