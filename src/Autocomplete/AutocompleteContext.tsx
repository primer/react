import {createContext} from 'react'

export const AutocompleteContext = createContext<{
  activeDescendantRef?: React.MutableRefObject<HTMLElement | null>
  autocompleteSuggestion?: string
  // TODO: consider changing `id` to `listboxId` because we're just using it to associate the input and combobox with the listbox
  id?: string
  inputRef?: React.MutableRefObject<HTMLInputElement | null>
  inputValue?: string
  isMenuDirectlyActivated?: boolean
  scrollContainerRef?: React.MutableRefObject<HTMLElement | null>
  selectedItemLength?: number
  setAutocompleteSuggestion?: React.Dispatch<React.SetStateAction<string>>
  setInputValue?: React.Dispatch<React.SetStateAction<string>>
  setIsMenuDirectlyActivated?: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedItemLength?: React.Dispatch<React.SetStateAction<number | undefined>>
  setShowMenu?: React.Dispatch<React.SetStateAction<boolean>>
  showMenu?: boolean
}>({})
