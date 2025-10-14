import {
  Autocomplete as PrimerAutocomplete,
  type AutocompleteOverlayProps as PrimerAutocompleteOverlayProps,
  type AutocompleteInputProps as PrimerAutocompleteInputProps,
  type SlotMarker,
} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type {ComponentProps} from 'react'

export type AutocompleteOverlayProps = PrimerAutocompleteOverlayProps & SxProp

const AutocompleteOverlay: React.ComponentType<AutocompleteOverlayProps> & SlotMarker = styled(
  PrimerAutocomplete.Overlay,
).withConfig({
  shouldForwardProp: prop => (prop as keyof AutocompleteOverlayProps) !== 'sx',
})<AutocompleteOverlayProps>`
  ${sx}
`

export type AutocompleteInputProps = PrimerAutocompleteInputProps & SxProp

const AutocompleteInput: React.ComponentType<AutocompleteInputProps> = styled(PrimerAutocomplete.Input).withConfig({
  shouldForwardProp: prop => (prop as keyof AutocompleteInputProps) !== 'sx',
})<AutocompleteInputProps>`
  ${sx}
`

interface AutocompleteExport {
  (props: ComponentProps<typeof PrimerAutocomplete>): React.ReactNode
  Context: typeof PrimerAutocomplete.Context
  Input: typeof AutocompleteInput
  Menu: typeof PrimerAutocomplete.Menu
  Overlay: typeof AutocompleteOverlay
}

const Autocomplete: AutocompleteExport = Object.assign(PrimerAutocomplete, {
  Context: PrimerAutocomplete.Context,
  Input: AutocompleteInput,
  Menu: PrimerAutocomplete.Menu,
  Overlay: AutocompleteOverlay,
})

AutocompleteOverlay.__SLOT__ = PrimerAutocomplete.Overlay.__SLOT__

export {Autocomplete}
