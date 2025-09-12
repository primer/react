import {Box, Select as PrimerSelect, type SelectProps as PrimerSelectProps} from '@primer/react'
import {forwardRef, type PropsWithChildren} from 'react'
import type {SxProp} from '../sx'

type SelectProps = PropsWithChildren<PrimerSelectProps> & SxProp

const SelectImpl: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>> = forwardRef<
  HTMLSelectElement,
  SelectProps
>(function Select(props, ref) {
  return <Box as={PrimerSelect as React.ElementType} ref={ref} {...props} />
})

// Type annotation needed because Select uses `@primer/react` internals:
// `TextInputWrapper` component and `FormValidationStatus` type
const Select: typeof SelectImpl & {
  Option: typeof PrimerSelect.Option
  OptGroup: typeof PrimerSelect.OptGroup
} = Object.assign(SelectImpl, {
  Option: PrimerSelect.Option,
  OptGroup: PrimerSelect.OptGroup,
})

export {Select}
export type {SelectProps}
