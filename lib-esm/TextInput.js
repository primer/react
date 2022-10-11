import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import TextInputInnerVisualSlot from './_TextInputInnerVisualSlot.js';
import TextInputWrapper from './_TextInputWrapper.js';
import UnstyledTextInput from './_UnstyledTextInput.js';
import TextInputAction from './_TextInputInnerAction.js';
import { useProvidedRefOrCreate } from './hooks/useProvidedRefOrCreate.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInput = /*#__PURE__*/React.forwardRef(({
  icon: IconComponent,
  leadingVisual: LeadingVisual,
  trailingVisual: TrailingVisual,
  trailingAction,
  block,
  className,
  contrast,
  disabled,
  loading,
  loaderPosition,
  monospace,
  validationStatus,
  sx: sxProp,
  size: sizeProp,
  onFocus,
  onBlur,
  // start deprecated props
  width: widthProp,
  minWidth: minWidthProp,
  maxWidth: maxWidthProp,
  variant: variantProp,
  // end deprecated props
  ...inputProps
}, ref) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useProvidedRefOrCreate(ref); // this class is necessary to style FilterSearch, plz no touchy!

  const wrapperClasses = classnames(className, 'TextInput-wrapper');
  const showLeadingLoadingIndicator = loading && (loaderPosition === 'leading' || Boolean(LeadingVisual && loaderPosition !== 'trailing'));
  const showTrailingLoadingIndicator = loading && (loaderPosition === 'trailing' || Boolean(loaderPosition === 'auto' && !LeadingVisual));

  const focusInput = () => {
    var _inputRef$current;

    (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
  };

  const handleInputFocus = useCallback(e => {
    setIsInputFocused(true);
    onFocus && onFocus(e);
  }, [onFocus]);
  const handleInputBlur = useCallback(e => {
    setIsInputFocused(false);
    onBlur && onBlur(e);
  }, [onBlur]);
  return /*#__PURE__*/React.createElement(TextInputWrapper, {
    block: block,
    className: wrapperClasses,
    validationStatus: validationStatus,
    contrast: contrast,
    disabled: disabled,
    monospace: monospace,
    sx: sxProp,
    size: sizeProp,
    width: widthProp,
    minWidth: minWidthProp,
    maxWidth: maxWidthProp,
    variant: variantProp,
    hasLeadingVisual: Boolean(LeadingVisual || showLeadingLoadingIndicator),
    hasTrailingVisual: Boolean(TrailingVisual || showTrailingLoadingIndicator),
    hasTrailingAction: Boolean(trailingAction),
    isInputFocused: isInputFocused,
    onClick: focusInput,
    "aria-live": "polite",
    "aria-busy": Boolean(loading)
  }, IconComponent && /*#__PURE__*/React.createElement(IconComponent, {
    className: "TextInput-icon"
  }), /*#__PURE__*/React.createElement(TextInputInnerVisualSlot, {
    visualPosition: "leading",
    showLoadingIndicator: showLeadingLoadingIndicator,
    hasLoadingIndicator: typeof loading === 'boolean'
  }, typeof LeadingVisual === 'function' ? /*#__PURE__*/React.createElement(LeadingVisual, null) : LeadingVisual), /*#__PURE__*/React.createElement(UnstyledTextInput, _extends({
    ref: inputRef,
    disabled: disabled,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur
  }, inputProps, {
    "data-component": "input"
  })), /*#__PURE__*/React.createElement(TextInputInnerVisualSlot, {
    visualPosition: "trailing",
    showLoadingIndicator: showTrailingLoadingIndicator,
    hasLoadingIndicator: typeof loading === 'boolean'
  }, typeof TrailingVisual === 'function' ? /*#__PURE__*/React.createElement(TrailingVisual, null) : TrailingVisual), trailingAction);
});
TextInput.defaultProps = {
  type: 'text',
  loaderPosition: 'auto'
};
TextInput.displayName = 'TextInput';
var TextInput$1 = Object.assign(TextInput, {
  Action: TextInputAction
});

export { TextInput$1 as default };
