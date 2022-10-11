'use strict';

var React = require('react');
var ssr = require('@react-aria/ssr');
var AutocompleteContext = require('./AutocompleteContext.js');
var AutocompleteInput = require('./AutocompleteInput.js');
var AutocompleteMenu = require('./AutocompleteMenu.js');
var AutocompleteOverlay = require('./AutocompleteOverlay.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
  const activeDescendantRef = React.useRef(null);
  const scrollContainerRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    inputValue,
    showMenu,
    autocompleteSuggestion,
    isMenuDirectlyActivated,
    selectedItemLength
  } = state;
  const setInputValue = React.useCallback(value => {
    dispatch({
      type: 'inputValue',
      payload: value
    });
  }, []);
  const setShowMenu = React.useCallback(value => {
    dispatch({
      type: 'showMenu',
      payload: value
    });
  }, []);
  const setAutocompleteSuggestion = React.useCallback(value => {
    dispatch({
      type: 'autocompleteSuggestion',
      payload: value
    });
  }, []);
  const setIsMenuDirectlyActivated = React.useCallback(value => {
    dispatch({
      type: 'isMenuDirectlyActivated',
      payload: value
    });
  }, []);
  const setSelectedItemLength = React.useCallback(value => {
    dispatch({
      type: 'selectedItemLength',
      payload: value
    });
  }, []);
  const id = ssr.useSSRSafeId(idProp);
  return /*#__PURE__*/React__default["default"].createElement(AutocompleteContext.AutocompleteContext.Provider, {
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
  Context: AutocompleteContext.AutocompleteContext,
  Input: AutocompleteInput,
  Menu: AutocompleteMenu,
  Overlay: AutocompleteOverlay
});

module.exports = Autocomplete$1;
