import type React from 'react'
import {useCallback, useDeferredValue, useMemo, useReducer, useRef} from 'react'
import type {ComponentProps, FCWithSlotMarker} from '../utils/types'
import {AutocompleteContext, AutocompleteInputContext, AutocompleteDeferredInputContext} from './AutocompleteContext'
import AutocompleteInput from './AutocompleteInput'
import AutocompleteMenu from './AutocompleteMenu'
import AutocompleteOverlay from './AutocompleteOverlay'
import {useId} from '../hooks/useId'

type Action =
  | {type: 'showMenu' | 'isMenuDirectlyActivated'; payload: boolean}
  | {type: 'autocompleteSuggestion' | 'inputValue'; payload: string}
  | {type: 'selectedItemLength'; payload: number}

interface State {
  inputValue: string
  showMenu: boolean
  isMenuDirectlyActivated: boolean
  autocompleteSuggestion: string
  selectedItemLength: number
}

const initialState = {
  inputValue: '',
  showMenu: false,
  isMenuDirectlyActivated: false,
  autocompleteSuggestion: '',
  selectedItemLength: 0,
}

const reducer = (state: State, action: Action) => {
  const {type, payload} = action
  switch (type) {
    case 'inputValue':
      return {...state, inputValue: payload as State['inputValue']}
    case 'showMenu':
      return {...state, showMenu: payload as State['showMenu']}
    case 'isMenuDirectlyActivated':
      return {...state, isMenuDirectlyActivated: payload as State['isMenuDirectlyActivated']}
    case 'autocompleteSuggestion':
      return {...state, autocompleteSuggestion: payload as State['autocompleteSuggestion']}
    case 'selectedItemLength':
      return {...state, selectedItemLength: payload as State['selectedItemLength']}
    default:
      return state
  }
}

const Autocomplete: FCWithSlotMarker<React.PropsWithChildren<{id?: string}>> = ({children, id: idProp}) => {
  const activeDescendantRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, dispatch] = useReducer(reducer, initialState)
  const {inputValue, showMenu, autocompleteSuggestion, isMenuDirectlyActivated, selectedItemLength} = state
  const setInputValue = useCallback((value: State['inputValue']) => {
    dispatch({type: 'inputValue', payload: value})
  }, [])
  const setShowMenu = useCallback((value: State['showMenu']) => {
    dispatch({type: 'showMenu', payload: value})
  }, [])
  const setAutocompleteSuggestion = useCallback((value: State['autocompleteSuggestion']) => {
    dispatch({type: 'autocompleteSuggestion', payload: value})
  }, [])
  const setIsMenuDirectlyActivated = useCallback((value: State['isMenuDirectlyActivated']) => {
    dispatch({type: 'isMenuDirectlyActivated', payload: value})
  }, [])
  const setSelectedItemLength = useCallback((value: State['selectedItemLength']) => {
    dispatch({type: 'selectedItemLength', payload: value})
  }, [])
  const id = useId(idProp)

  // Base context: refs, IDs, menu visibility, and callbacks
  // Changes when menu opens/closes or selection changes, but NOT on every keystroke
  const autocompleteContextValue = useMemo(
    () => ({
      activeDescendantRef,
      id,
      inputRef,
      scrollContainerRef,
      selectedItemLength,
      setAutocompleteSuggestion,
      setInputValue,
      setIsMenuDirectlyActivated,
      setShowMenu,
      setSelectedItemLength,
      showMenu,
    }),
    [
      id,
      selectedItemLength,
      setAutocompleteSuggestion,
      setInputValue,
      setIsMenuDirectlyActivated,
      setShowMenu,
      setSelectedItemLength,
      showMenu,
    ],
  )

  // Input state context: values that change on every keystroke
  // Split to prevent Overlay from re-rendering during typing
  const autocompleteInputContextValue = useMemo(
    () => ({
      autocompleteSuggestion,
      inputValue,
      isMenuDirectlyActivated,
    }),
    [autocompleteSuggestion, inputValue, isMenuDirectlyActivated],
  )

  // Deferred input value for expensive operations like filtering
  // Menu subscribes to this instead of inputValue to avoid re-rendering on every keystroke
  const deferredInputValue = useDeferredValue(inputValue)
  const autocompleteDeferredInputContextValue = useMemo(() => ({deferredInputValue}), [deferredInputValue])

  return (
    <AutocompleteContext.Provider value={autocompleteContextValue}>
      <AutocompleteInputContext.Provider value={autocompleteInputContextValue}>
        <AutocompleteDeferredInputContext.Provider value={autocompleteDeferredInputContextValue}>
          {children}
        </AutocompleteDeferredInputContext.Provider>
      </AutocompleteInputContext.Provider>
    </AutocompleteContext.Provider>
  )
}

export type AutocompleteProps = ComponentProps<typeof Autocomplete>
export type {AutocompleteInputProps} from './AutocompleteInput'
export type {AutocompleteMenuProps} from './AutocompleteMenu'
export type {AutocompleteOverlayProps} from './AutocompleteOverlay'
export default Object.assign(Autocomplete, {
  __SLOT__: Symbol('Autocomplete'),
  Context: AutocompleteContext,
  Input: AutocompleteInput,
  Menu: AutocompleteMenu,
  Overlay: AutocompleteOverlay,
})
