import {createContext} from 'react'

export const AutocompleteContext = createContext<{
  activeDescendantRef: React.MutableRefObject<HTMLElement | null>
  autocompleteSuggestion: string
  // TODO: consider changing `id` to `listboxId` because we're just using it to associate the input and combobox with the listbox
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  inputValue: string
  isMenuDirectlyActivated: boolean
  scrollContainerRef: React.MutableRefObject<HTMLElement | null>
  selectedItemLength: number
  setAutocompleteSuggestion: (value: string) => void
  setInputValue: (value: string) => void
  setIsMenuDirectlyActivated: (value: boolean) => void
  setSelectedItemLength: (value: number) => void
  setShowMenu: (value: boolean) => void
  showMenu: boolean
} | null>(null)
