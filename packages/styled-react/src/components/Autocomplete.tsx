import {
  Autocomplete as PrimerAutocomplete,
  type AutocompleteOverlayProps as PrimerAutocompleteOverlayProps,
} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type {ComponentProps} from 'react'

export type AutocompleteOverlayProps = PrimerAutocompleteOverlayProps & SxProp

const AutocompleteOverlay: React.ComponentType<AutocompleteOverlayProps> = styled(
  PrimerAutocomplete.Overlay,
).withConfig({
  shouldForwardProp: prop => (prop as keyof AutocompleteOverlayProps) !== 'sx',
})<AutocompleteOverlayProps>`
  ${sx}
`

interface AutocompleteExport {
  (props: ComponentProps<typeof PrimerAutocomplete>): React.ReactNode
  Context: typeof PrimerAutocomplete.Context
  Input: typeof PrimerAutocomplete.Input
  Menu: typeof PrimerAutocomplete.Menu
  Overlay: typeof AutocompleteOverlay
}

const Autocomplete: AutocompleteExport = Object.assign(PrimerAutocomplete, {
  Context: PrimerAutocomplete.Context,
  Input: PrimerAutocomplete.Input,
  Menu: PrimerAutocomplete.Menu,
  Overlay: AutocompleteOverlay,
})

// @ts-ignore - TS doesn't know about the __SLOT__ property
Autocomplete.__SLOT__ = Symbol('Autocomplete')

export {Autocomplete}
