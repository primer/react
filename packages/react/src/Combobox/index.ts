import {
  ComboboxRoot,
  ComboboxList,
  ComboboxOption,
  ComboboxGroup,
  ComboboxInput,
  ComboboxTitle,
  Combobox as ComboboxComponent,
} from './Combobox'

export const Combobox = Object.assign(ComboboxComponent, {
  Root: ComboboxRoot,
  /** List container for combobox options */
  List: ComboboxList,
  /** Individual option in the combobox */
  Option: ComboboxOption,
  /** Group of related options */
  Group: ComboboxGroup,
  /** Input field for the combobox */
  Input: ComboboxInput,
  /** Title component for the combobox */
  Title: ComboboxTitle,
})
