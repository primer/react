import {createContext} from 'react'

/**
 * Base context containing refs, stable IDs, menu visibility state, and callbacks.
 * This context changes when menu opens/closes or selection changes, but NOT on every keystroke.
 * Consumers like AutocompleteOverlay that don't need input text should use only this context.
 */
export const AutocompleteContext = createContext<{
  activeDescendantRef: React.MutableRefObject<HTMLElement | null>
  // TODO: consider changing `id` to `listboxId` because we're just using it to associate the input and combobox with the listbox
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  scrollContainerRef: React.MutableRefObject<HTMLElement | null>
  selectedItemLength: number
  setAutocompleteSuggestion: (value: string) => void
  setInputValue: (value: string) => void
  setIsMenuDirectlyActivated: (value: boolean) => void
  setSelectedItemLength: (value: number) => void
  setShowMenu: (value: boolean) => void
  showMenu: boolean
} | null>(null)

/**
 * Input-related state that changes on every keystroke.
 * Only AutocompleteInput needs this for immediate text display and suggestion highlighting.
 */
export const AutocompleteInputContext = createContext<{
  autocompleteSuggestion: string
  inputValue: string
  isMenuDirectlyActivated: boolean
} | null>(null)

/**
 * Deferred input value for expensive operations like filtering.
 * Uses React's useDeferredValue to allow typing to remain responsive while
 * filtering large lists at lower priority.
 * AutocompleteMenu uses this to avoid blocking keystrokes during filtering.
 */
export const AutocompleteDeferredInputContext = createContext<{
  deferredInputValue: string
} | null>(null)
