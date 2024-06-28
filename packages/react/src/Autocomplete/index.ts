import {Autocomplete as AutocompleteImpl} from './Autocomplete'
import {AutocompleteContext} from './AutocompleteContext'
import {AutocompleteInput} from './AutocompleteInput'
import {AutocompleteMenu} from './AutocompleteMenu'
import {AutocompleteOverlay} from './AutocompleteOverlay'
import type {AutocompleteInputProps} from './AutocompleteInput'
import type {AutocompleteMenuProps} from './AutocompleteMenu'
import type {AutocompleteOverlayProps} from './AutocompleteOverlay'

export const Autocomplete = Object.assign(AutocompleteImpl, {
  Context: AutocompleteContext,
  Input: AutocompleteInput,
  Menu: AutocompleteMenu,
  Overlay: AutocompleteOverlay,
})

export type {AutocompleteInputProps, AutocompleteMenuProps, AutocompleteOverlayProps}
