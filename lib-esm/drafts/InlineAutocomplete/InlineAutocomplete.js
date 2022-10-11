import React, { useRef, cloneElement } from 'react';
import Box from '../../Box.js';
import Portal from '../../Portal/index.js';
import { getAbsoluteCharacterCoordinates } from '../utils/character-coordinates.js';
import { useSyntheticChange } from '../hooks/useSyntheticChange.js';
import { requireChildrenToBeInput, augmentHandler, getSuggestionValue, calculateSuggestionsQuery } from './utils.js';
import AutocompleteSuggestions from './_AutocompleteSuggestions.js';
import { useRefObjectAsForwardedRef } from '../../hooks/useRefObjectAsForwardedRef.js';

const getSelectionStart = element => {
  try {
    return element.selectionStart;
  } catch (e) {
    // Safari throws an exception when trying to access selectionStart on date input element
    if (e instanceof TypeError) return null;
    throw e;
  }
};

const noop = () => {// don't do anything
};
/**
 * Shows suggestions to complete the current word/phrase the user is actively typing.
 */


const InlineAutocomplete = ({
  triggers,
  suggestions,
  onShowSuggestions,
  onHideSuggestions,
  sx,
  children,
  tabInsertsSuggestions = false,
  // Forward accessibility props so it works with FormControl
  ...forwardProps
}) => {
  var _children$ref, _externalInput$props$, _getSelectionStart;

  const inputRef = useRef(null);
  useRefObjectAsForwardedRef((_children$ref = children.ref) !== null && _children$ref !== void 0 ? _children$ref : noop, inputRef);
  const externalInput = requireChildrenToBeInput(children, inputRef);
  const emitSyntheticChange = useSyntheticChange({
    inputRef,
    fallbackEventHandler: (_externalInput$props$ = externalInput.props.onChange) !== null && _externalInput$props$ !== void 0 ? _externalInput$props$ : noop
  });
  /** Stores the query that caused the current suggestion list to appear. */

  const showEventRef = useRef(null);
  const suggestionsVisible = suggestions !== null && suggestions.length > 0; // The suggestions don't usually move while open, so it seems as though this could be
  // optimized by only re-rendering when suggestionsVisible changes. However, the user
  // could move the cursor to a different location using arrow keys and then type a
  // trigger, which would move the suggestions without closing/reopening them.

  const triggerCharCoords = inputRef.current && showEventRef.current && suggestionsVisible ? getAbsoluteCharacterCoordinates(inputRef.current, ((_getSelectionStart = getSelectionStart(inputRef.current)) !== null && _getSelectionStart !== void 0 ? _getSelectionStart : 0) - showEventRef.current.query.length) : {
    top: 0,
    left: 0,
    height: 0
  };
  const suggestionsOffset = {
    top: triggerCharCoords.top + triggerCharCoords.height,
    left: triggerCharCoords.left
  }; // User can blur while suggestions are visible with shift+tab

  const onBlur = () => {
    onHideSuggestions();
  }; // Even though the overlay has an Escape listener, it only works when focus is inside
  // the overlay; in this case the textarea is focused


  const onKeyDown = event => {
    if (suggestionsVisible && event.key === 'Escape') {
      onHideSuggestions();
      event.stopPropagation();
    }
  };

  const onChange = event => {
    const selectionStart = getSelectionStart(event.currentTarget);

    if (selectionStart === null) {
      onHideSuggestions();
      return;
    }

    showEventRef.current = calculateSuggestionsQuery(triggers, event.currentTarget.value, selectionStart);

    if (showEventRef.current) {
      onShowSuggestions(showEventRef.current);
    } else {
      onHideSuggestions();
    }
  };

  const onCommit = suggestion => {
    var _getSelectionStart2, _trigger$keepTriggerC;

    if (!inputRef.current || !showEventRef.current) return;
    const {
      query,
      trigger
    } = showEventRef.current;
    const currentCaretPosition = (_getSelectionStart2 = getSelectionStart(inputRef.current)) !== null && _getSelectionStart2 !== void 0 ? _getSelectionStart2 : 0;
    const deleteLength = query.length + trigger.triggerChar.length;
    const startIndex = currentCaretPosition - deleteLength;
    const keepTriggerChar = (_trigger$keepTriggerC = trigger.keepTriggerCharOnCommit) !== null && _trigger$keepTriggerC !== void 0 ? _trigger$keepTriggerC : true;
    const maybeTriggerChar = keepTriggerChar ? trigger.triggerChar : '';
    const replacement = `${maybeTriggerChar}${suggestion} `;
    emitSyntheticChange(replacement, [startIndex, startIndex + deleteLength]);
    onHideSuggestions();
  };

  const input = /*#__PURE__*/cloneElement(externalInput, { ...forwardProps,
    onBlur: augmentHandler(externalInput.props.onBlur, onBlur),
    onKeyDown: augmentHandler(externalInput.props.onKeyDown, onKeyDown),
    onChange: augmentHandler(externalInput.props.onChange, onChange),
    ref: inputRef
  });
  /**
   * Even thoughn we apply all the aria attributes, screen readers don't fully support this
   * dynamic use case and so they don't have a native way to indicate to the user when
   * there are suggestions available. So we use some hidden text with aria-live to politely
   * indicate what's available and how to use it.
   *
   * This text should be consistent and the important info should be first, because users
   * will hear it as they type - if they have heard the message before they should be able
   * to recognize it and quickly apply the first suggestion without listening to the rest
   * of the message.
   *
   * When screen reader users navigate using arrow keys, the `aria-activedescendant` will
   * change and will be read out so we don't need to handle that interaction here.
   */

  const suggestionsDescription = !suggestionsVisible ? '' : suggestions === 'loading' ? 'Loading autocomplete suggestions…' : // It's important to include both Enter and Tab because we are telling the user that we are hijacking these keys:
  `${suggestions.length} autocomplete ${suggestions.length === 1 ? 'suggestion' : 'suggestions'} available; "${getSuggestionValue(suggestions[0])}" is highlighted. Press ${tabInsertsSuggestions ? 'Enter or Tab' : 'Enter'} to insert.`;
  return (
    /*#__PURE__*/
    // Try to get as close as possible to making the container 'invisible' by making it shrink tight to child input
    React.createElement(Box, {
      sx: {
        display: 'inline-block',
        '& > *': {
          width: '100%'
        },
        ...sx,
        position: 'relative'
      }
    }, input, /*#__PURE__*/React.createElement(AutocompleteSuggestions, {
      suggestions: suggestions,
      inputRef: inputRef,
      onCommit: onCommit,
      onClose: onHideSuggestions,
      top: suggestionsOffset.top,
      left: suggestionsOffset.left,
      visible: suggestionsVisible,
      tabInsertsSuggestions: tabInsertsSuggestions
    }), /*#__PURE__*/React.createElement(Portal, null, /*#__PURE__*/React.createElement("span", {
      "aria-live": "assertive",
      "aria-atomic": true,
      style: {
        clipPath: 'circle(0)',
        position: 'absolute'
      }
    }, suggestionsDescription)))
  );
};

InlineAutocomplete.displayName = "InlineAutocomplete";
var InlineAutocomplete$1 = InlineAutocomplete;

export { InlineAutocomplete$1 as default };
