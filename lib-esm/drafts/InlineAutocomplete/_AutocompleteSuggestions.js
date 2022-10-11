import React, { useState, useCallback } from 'react';
import StyledSpinner from '../../Spinner.js';
import { ActionList } from '../../ActionList/index.js';
import Box from '../../Box.js';
import { useCombobox } from '../hooks/useCombobox.js';
import Overlay from '../../Overlay.js';
import { getSuggestionValue, getSuggestionKey } from './utils.js';

const LoadingIndicator = () => /*#__PURE__*/React.createElement(Box, {
  sx: {
    display: 'flex',
    justifyContent: 'center',
    py: 2
  }
}, /*#__PURE__*/React.createElement(StyledSpinner, {
  size: "small"
}));

LoadingIndicator.displayName = "LoadingIndicator";

const SuggestionListItem = ({
  suggestion
}) => {
  const value = getSuggestionValue(suggestion);
  const sharedProps = {
    id: value,
    children: value,
    role: 'option',
    sx: {
      '&[aria-selected]': {
        backgroundColor: 'actionListItem.default.activeBg'
      },
      '&[data-combobox-option-default]:not([aria-selected])': {
        backgroundColor: 'actionListItem.default.selectedBg'
      }
    }
  };
  return typeof suggestion === 'string' ? /*#__PURE__*/React.createElement(ActionList.Item, sharedProps) : suggestion.render(sharedProps);
};
/**
 * Renders an overlayed list at the given relative coordinates. Handles keyboard navigation
 * and accessibility concerns.
 */


const AutocompleteSuggestions = ({
  suggestions,
  portalName,
  top,
  left,
  onClose,
  onCommit: externalOnCommit,
  inputRef,
  visible,
  tabInsertsSuggestions
}) => {
  // It seems wierd to use state instead of a ref here, but because the list is inside an
  // AnchoredOverlay it is not always mounted - so we want to reinitialize the Combobox when it mounts
  const [list, setList] = useState(null);
  const onCommit = useCallback(({
    option
  }) => {
    externalOnCommit(getSuggestionValue(option));
  }, [externalOnCommit]); // Setup keyboard navigation

  useCombobox({
    // Even though the list is visible when loading, we don't want to do keyboard binding in that case
    isOpen: visible && suggestions !== 'loading',
    listElement: list,
    inputElement: inputRef.current,
    onCommit,
    options: Array.isArray(suggestions) ? suggestions : [],
    tabInsertsSuggestions,
    defaultFirstOption: true
  }); // Conditional rendering appears wrong at first - it means that we are reconstructing the
  // Combobox instance every time the suggestions appear. But this is what we want - otherwise
  // the textarea would always have the `combobox` role, which is incorrect (a textarea should
  // not technically ever be a combobox). We compromise by dynamically applying the combobox
  // role only when suggestions are available.

  return visible ? /*#__PURE__*/React.createElement(Overlay, {
    onEscape: onClose,
    onClickOutside: onClose,
    returnFocusRef: inputRef,
    preventFocusOnOpen: true,
    portalContainerName: portalName,
    sx: {
      position: 'fixed'
    },
    top,
    left
  }, /*#__PURE__*/React.createElement(ActionList, {
    ref: setList
  }, suggestions === 'loading' ? /*#__PURE__*/React.createElement(LoadingIndicator, null) : suggestions === null || suggestions === void 0 ? void 0 : suggestions.map(suggestion => /*#__PURE__*/React.createElement(SuggestionListItem, {
    suggestion: suggestion,
    key: getSuggestionKey(suggestion)
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null);
};

AutocompleteSuggestions.displayName = 'SuggestionList';
var AutocompleteSuggestions$1 = AutocompleteSuggestions;

export { AutocompleteSuggestions$1 as default };
