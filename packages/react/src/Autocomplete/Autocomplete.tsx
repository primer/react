import React, {useCallback, useReducer, useRef} from 'react'
import type {FC, PropsWithChildren} from 'react'
import {AutocompleteContext} from './AutocompleteContext'
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

export type AutocompleteProps = PropsWithChildren<{
  /** May be used to customize how the ID is set on the text input to be used by ARIA attributes on related elements. */
  id?: string
}>

/**
 * Autocomplete allows users to quickly filter through a list of options and pick one or more values for a field.
 * @primerid autocomplete
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export const Autocomplete: FC<AutocompleteProps> = ({children, id: idProp}) => {
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

  return (
    <AutocompleteContext.Provider
      value={{
        activeDescendantRef,
        autocompleteSuggestion,
        id,
        inputRef,
        inputValue,
        isMenuDirectlyActivated,
        scrollContainerRef,
        selectedItemLength,
        setAutocompleteSuggestion,
        setInputValue,
        setIsMenuDirectlyActivated,
        setShowMenu,
        setSelectedItemLength,
        showMenu,
      }}
    >
      {children}
    </AutocompleteContext.Provider>
  )
}
