import React, { useRef, useState } from 'react'
import { ComponentProps } from '../utils/types';
import { uniqueId } from '../utils/uniqueId';
import { AutocompleteContext } from './AutocompleteContext'
import AutocompleteInput from './AutocompleteInput';
import AutocompleteMenu from './AutocompleteMenu';
import AutocompleteOverlay from './AutocompleteOverlay';


const Autocomplete: React.FC<{id?: string}> = ({ children, id: idProp }) => {
    const activeDescendantRef = useRef<HTMLElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [showMenu, setShowMenu] = useState(false)
    const [autocompleteSuggestion, setAutocompleteSuggestion] = useState<string>('')
    const [isMenuDirectlyActivated, setIsMenuDirectlyActivated] = useState<boolean>(false)
    const [selectedItemLength, setSelectedItemLength] = useState<number>()
    const id = idProp || uniqueId()

    return (
      <AutocompleteContext.Provider value={{
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
      }}>
        {children}
      </AutocompleteContext.Provider>
    )
  }

export type AutocompleteProps = ComponentProps<typeof Autocomplete>
export type { AutocompleteInputProps } from './AutocompleteInput'
export type { AutocompleteMenuProps } from './AutocompleteMenu'
export type { AutocompleteOverlayProps } from './AutocompleteOverlay'
export default Object.assign(Autocomplete, {
    AutocompleteContext,
    Input: AutocompleteInput,
    Menu: AutocompleteMenu,
    Overlay: AutocompleteOverlay
})
  
