import React, {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {AutocompleteContext} from './AutocompleteContext'
import TextInput from '../TextInput'
import {useCombinedRefs} from '../hooks/useCombinedRefs'
import {ComponentProps} from '../utils/types'

type InternalAutocompleteInputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any>
}

const AutocompleteInput = React.forwardRef(
  (
    {as: Component = TextInput, onFocus, onBlur, onChange, onKeyDown, onKeyUp, onKeyPress, value, ...props},
    forwardedRef
  ) => {
    const autocompleteContext = useContext(AutocompleteContext)
    if (autocompleteContext === null) {
      throw new Error('AutocompleteContext returned null values')
    }
    const {
      activeDescendantRef,
      autocompleteSuggestion = '',
      id,
      inputRef,
      inputValue = '',
      isMenuDirectlyActivated,
      setInputValue,
      setShowMenu,
      showMenu
    } = autocompleteContext
    const combinedInputRef = useCombinedRefs(inputRef, forwardedRef)
    const [highlightRemainingText, setHighlightRemainingText] = useState<boolean>(true)

    const handleInputFocus: FocusEventHandler<HTMLInputElement> = useCallback(
      event => {
        onFocus && onFocus(event)
        setShowMenu(true)
      },
      [onFocus, setShowMenu]
    )

    const handleInputBlur: FocusEventHandler<HTMLInputElement> = useCallback(
      event => {
        onBlur && onBlur(event)

        // HACK: wait a tick and check the focused element before hiding the autocomplete menu
        // this prevents the menu from hiding when the user is clicking an option in the Autoselect.Menu,
        // but still hides the menu when the user blurs the input by tabbing out or clicking somewhere else on the page
        setTimeout(() => {
          if (document.activeElement !== combinedInputRef.current) {
            setShowMenu(false)
          }
        }, 0)
      },
      [onBlur, setShowMenu, combinedInputRef]
    )

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      event => {
        onChange && onChange(event)
        setInputValue(event.currentTarget.value)
        if (!showMenu) {
          setShowMenu(true)
        }
      },
      [onChange, setInputValue, setShowMenu, showMenu]
    )

    const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
      event => {
        onKeyDown && onKeyDown(event)

        if (event.key === 'Backspace') {
          setHighlightRemainingText(false)
        }

        if (event.key === 'Escape' && inputRef.current?.value) {
          setInputValue('')
          inputRef.current.value = ''
        }
      },
      [inputRef, setInputValue, setHighlightRemainingText, onKeyDown]
    )

    const handleInputKeyUp: KeyboardEventHandler<HTMLInputElement> = useCallback(
      event => {
        onKeyUp && onKeyUp(event)

        if (event.key === 'Backspace') {
          setHighlightRemainingText(true)
        }
      },
      [setHighlightRemainingText, onKeyUp]
    )

    const onInputKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback(
      event => {
        onKeyPress && onKeyPress(event)

        if (showMenu && event.key === 'Enter' && activeDescendantRef.current) {
          event.preventDefault()
          event.nativeEvent.stopImmediatePropagation()

          // Forward Enter key press to active descendant so that item gets activated
          const activeDescendantEvent = new KeyboardEvent(event.type, event.nativeEvent)
          activeDescendantRef.current.dispatchEvent(activeDescendantEvent)
        }
      },
      [activeDescendantRef, showMenu, onKeyPress]
    )

    useEffect(() => {
      if (!inputRef.current) {
        return
      }

      // resets input value to being empty after a selection has been made
      if (!autocompleteSuggestion) {
        inputRef.current.value = inputValue
      }

      // TODO: fix bug where this function prevents `onChange` from being triggered if the highlighted item text
      //       is the same as what I'm typing
      //       e.g.: typing 'tw' highights 'two', but when I 'two', the text input change does not get triggered
      if (highlightRemainingText && autocompleteSuggestion && (inputValue || isMenuDirectlyActivated)) {
        inputRef.current.value = autocompleteSuggestion

        if (autocompleteSuggestion.toLowerCase().indexOf(inputValue.toLowerCase()) === 0) {
          inputRef.current.setSelectionRange(inputValue.length, autocompleteSuggestion.length)
        }
      }

      // calling this useEffeect when `highlightRemainingText` changes breaks backspace functionality
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autocompleteSuggestion, inputValue, inputRef, isMenuDirectlyActivated])

    useEffect(() => {
      if (value) {
        setInputValue(value.toString())
      }
    }, [value, setInputValue])

    return (
      <Component
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onKeyPress={onInputKeyPress}
        onKeyUp={handleInputKeyUp}
        ref={combinedInputRef as MutableRefObject<HTMLInputElement>}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="both"
        role="combobox"
        aria-expanded={showMenu}
        aria-haspopup="listbox"
        aria-owns={`${id}-listbox`}
        autocomplete="off"
        {...props}
      />
    )
  }
) as PolymorphicForwardRefComponent<typeof TextInput, InternalAutocompleteInputProps>

AutocompleteInput.displayName = 'AutocompleteInput'

export type AutocompleteInputProps = ComponentProps<typeof AutocompleteInput>
export default AutocompleteInput
