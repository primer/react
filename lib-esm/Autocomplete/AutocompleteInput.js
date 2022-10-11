import React, { useContext, useState, useCallback, useEffect } from 'react';
import { AutocompleteContext } from './AutocompleteContext.js';
import TextInput from '../TextInput.js';
import { useRefObjectAsForwardedRef } from '../hooks/useRefObjectAsForwardedRef.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const AutocompleteInput = /*#__PURE__*/React.forwardRef(({
  as: Component = TextInput,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  onKeyUp,
  onKeyPress,
  value,
  ...props
}, forwardedRef) => {
  const autocompleteContext = useContext(AutocompleteContext);

  if (autocompleteContext === null) {
    throw new Error('AutocompleteContext returned null values');
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
  } = autocompleteContext;
  useRefObjectAsForwardedRef(forwardedRef, inputRef);
  const [highlightRemainingText, setHighlightRemainingText] = useState(true);
  const handleInputFocus = useCallback(event => {
    onFocus && onFocus(event);
    setShowMenu(true);
  }, [onFocus, setShowMenu]);
  const handleInputBlur = useCallback(event => {
    onBlur && onBlur(event); // HACK: wait a tick and check the focused element before hiding the autocomplete menu
    // this prevents the menu from hiding when the user is clicking an option in the Autoselect.Menu,
    // but still hides the menu when the user blurs the input by tabbing out or clicking somewhere else on the page

    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setShowMenu(false);
      }
    }, 0);
  }, [onBlur, setShowMenu, inputRef]);
  const handleInputChange = useCallback(event => {
    onChange && onChange(event);
    setInputValue(event.currentTarget.value);

    if (!showMenu) {
      setShowMenu(true);
    }
  }, [onChange, setInputValue, setShowMenu, showMenu]);
  const handleInputKeyDown = useCallback(event => {
    var _inputRef$current;

    onKeyDown && onKeyDown(event);

    if (event.key === 'Backspace') {
      setHighlightRemainingText(false);
    }

    if (event.key === 'Escape' && (_inputRef$current = inputRef.current) !== null && _inputRef$current !== void 0 && _inputRef$current.value) {
      setInputValue('');
      inputRef.current.value = '';
    }
  }, [inputRef, setInputValue, setHighlightRemainingText, onKeyDown]);
  const handleInputKeyUp = useCallback(event => {
    onKeyUp && onKeyUp(event);

    if (event.key === 'Backspace') {
      setHighlightRemainingText(true);
    }
  }, [setHighlightRemainingText, onKeyUp]);
  const onInputKeyPress = useCallback(event => {
    onKeyPress && onKeyPress(event);

    if (showMenu && event.key === 'Enter' && activeDescendantRef.current) {
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation(); // Forward Enter key press to active descendant so that item gets activated

      const activeDescendantEvent = new KeyboardEvent(event.type, event.nativeEvent);
      activeDescendantRef.current.dispatchEvent(activeDescendantEvent);
    }
  }, [activeDescendantRef, showMenu, onKeyPress]);
  useEffect(() => {
    if (!inputRef.current) {
      return;
    } // resets input value to being empty after a selection has been made


    if (!autocompleteSuggestion) {
      inputRef.current.value = inputValue;
    } // TODO: fix bug where this function prevents `onChange` from being triggered if the highlighted item text
    //       is the same as what I'm typing
    //       e.g.: typing 'tw' highlights 'two', but when I 'two', the text input change does not get triggered


    if (highlightRemainingText && autocompleteSuggestion && (inputValue || isMenuDirectlyActivated)) {
      inputRef.current.value = autocompleteSuggestion;

      if (autocompleteSuggestion.toLowerCase().indexOf(inputValue.toLowerCase()) === 0) {
        inputRef.current.setSelectionRange(inputValue.length, autocompleteSuggestion.length);
      }
    } // calling this useEffect when `highlightRemainingText` changes breaks backspace functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [autocompleteSuggestion, inputValue, inputRef, isMenuDirectlyActivated]);
  useEffect(() => {
    setInputValue(typeof value !== 'undefined' ? value.toString() : '');
  }, [value, setInputValue]);
  return /*#__PURE__*/React.createElement(Component, _extends({
    onFocus: handleInputFocus,
    onBlur: handleInputBlur,
    onChange: handleInputChange,
    onKeyDown: handleInputKeyDown,
    onKeyPress: onInputKeyPress,
    onKeyUp: handleInputKeyUp,
    ref: inputRef,
    "aria-controls": `${id}-listbox`,
    "aria-autocomplete": "both",
    role: "combobox",
    "aria-expanded": showMenu,
    "aria-haspopup": "listbox",
    "aria-owns": `${id}-listbox`,
    autoComplete: "off",
    id: id
  }, props));
});
AutocompleteInput.displayName = 'AutocompleteInput';
var AutocompleteInput$1 = AutocompleteInput;

export { AutocompleteInput$1 as default };
