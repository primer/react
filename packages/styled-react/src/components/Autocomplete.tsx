import {
  Autocomplete as PrimerAutocomplete,
  type AutocompleteInputProps as PrimerAutocompleteInputProps,
  Box,
} from '@primer/react'
import {forwardRef, type PropsWithChildren} from 'react'
import type {SxProp} from '../sx'

type AutocompleteProps = PropsWithChildren<Parameters<typeof PrimerAutocomplete>[0]> & SxProp

const AutocompleteImpl = forwardRef<HTMLDivElement, AutocompleteProps>(function Autocomplete(props, ref) {
  return <Box as={PrimerAutocomplete as React.ElementType} ref={ref} {...props} />
})

type AutocompleteInputProps = PropsWithChildren<PrimerAutocompleteInputProps> & SxProp

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(function AutocompleteInput(props, ref) {
  return <Box as={PrimerAutocomplete.Input} ref={ref} {...props} />
})

// Type annotation needed because Autocomplete's subcomponents use `@primer/react` internals
const Autocomplete: typeof AutocompleteImpl & {
  Input: typeof AutocompleteInput
  Menu: typeof PrimerAutocomplete.Menu
  Overlay: typeof PrimerAutocomplete.Overlay
} = Object.assign(AutocompleteImpl, {
  Input: AutocompleteInput,
  Menu: PrimerAutocomplete.Menu,
  Overlay: PrimerAutocomplete.Overlay,
})

export {Autocomplete}
export type {AutocompleteProps}
