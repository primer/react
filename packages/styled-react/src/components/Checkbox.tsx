import {Checkbox as PrimerCheckbox, type CheckboxProps as PrimerCheckboxProps} from '@primer/react'
import {Box} from './Box'
import {forwardRef} from 'react'
import {type SxProp} from '../sx'

export type CheckboxProps = PrimerCheckboxProps & SxProp

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <Box as={PrimerCheckbox} ref={ref} {...props} />
})

// @ts-ignore - TS doesn't know about the __SLOT__ property
Checkbox.__SLOT__ = PrimerCheckbox.__SLOT__
