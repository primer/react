import React, { useRef, useReducer, useCallback } from 'react';
import { useSSRSafeId } from '@react-aria/ssr';
import { AutocompleteContext } from './AutocompleteContext.js';
import AutocompleteInput from './AutocompleteInput.js';
import AutocompleteMenu from './AutocompleteMenu.js';
import AutocompleteOverlay from './AutocompleteOverlay.js';

const initialState = {
  inputValue: '',
  showMenu: false,
  isMenuDirectlyActivated: false,
  autocompleteSuggestion: '',
  selectedItemLength: 0
};

const reducer = (state, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case 'inputValue':
      return { ...state,
        inputValue: payload
      };

    case 'showMenu':
      return { ...state,
        showMenu: payload
      };

    case 'isMenuDirectlyActivated':
      return { ...state,
        isMenuDirectlyActivated: payload
      };

    case 'autocompleteSuggestion':
      return { ...state,
        autocompleteSuggestion: payload
      };

    case 'selectedItemLength':
      return { ...state,
        selectedItemLength: payload
      };

    default:
      return state;
  }
};

const Autocomplete = ({
  children,
  id: idProp
}) => {
  const activeDescendantRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    inputValue,
    showMenu,
    autocompleteSuggestion,
    isMenuDirectlyActivated,
    selectedItemLength
  } = state;
  const setInputValue = useCallback(value => {
    dispatch({
      type: 'inputValue',
      payload: value
    });
  }, []);
  const setShowMenu = useCallback(value => {
    dispatch({
      type: 'showMenu',
      payload: value
    });
  }, []);
  const setAutocompleteSuggestion = useCallback(value => {
    dispatch({
      type: 'autocompleteSuggestion',
      payload: value
    });
  }, []);
  const setIsMenuDirectlyActivated = useCallback(value => {
    dispatch({
      type: 'isMenuDirectlyActivated',
      payload: value
    });
  }, []);
  const setSelectedItemLength = useCallback(value => {
    dispatch({
      type: 'selectedItemLength',
      payload: value
    });
  }, []);
  const id = useSSRSafeId(idProp);
  return /*#__PURE__*/React.createElement(AutocompleteContext.Provider, {
    value: {
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
      showMenu
    }
  }, children);
};

Autocomplete.displayName = "Autocomplete";
var Autocomplete$1 = Object.assign(Autocomplete, {
  Context: AutocompleteContext,
  Input: AutocompleteInput,
  Menu: AutocompleteMenu,
  Overlay: AutocompleteOverlay
});

export { Autocomplete$1 as default };
