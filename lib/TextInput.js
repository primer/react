'use strict';

var React = require('react');
var classnames = require('classnames');
var _TextInputInnerVisualSlot = require('./_TextInputInnerVisualSlot.js');
var _TextInputWrapper = require('./_TextInputWrapper.js');
var _UnstyledTextInput = require('./_UnstyledTextInput.js');
var _TextInputInnerAction = require('./_TextInputInnerAction.js');
var useProvidedRefOrCreate = require('./hooks/useProvidedRefOrCreate.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInput = /*#__PURE__*/React__default["default"].forwardRef(({
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
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const inputRef = useProvidedRefOrCreate.useProvidedRefOrCreate(ref); // this class is necessary to style FilterSearch, plz no touchy!

  const wrapperClasses = classnames__default["default"](className, 'TextInput-wrapper');
  const showLeadingLoadingIndicator = loading && (loaderPosition === 'leading' || Boolean(LeadingVisual && loaderPosition !== 'trailing'));
  const showTrailingLoadingIndicator = loading && (loaderPosition === 'trailing' || Boolean(loaderPosition === 'auto' && !LeadingVisual));

  const focusInput = () => {
    var _inputRef$current;

    (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
  };

  const handleInputFocus = React.useCallback(e => {
    setIsInputFocused(true);
    onFocus && onFocus(e);
  }, [onFocus]);
  const handleInputBlur = React.useCallback(e => {
    setIsInputFocused(false);
    onBlur && onBlur(e);
  }, [onBlur]);
  return /*#__PURE__*/React__default["default"].createElement(_TextInputWrapper["default"], {
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
  }, IconComponent && /*#__PURE__*/React__default["default"].createElement(IconComponent, {
    className: "TextInput-icon"
  }), /*#__PURE__*/React__default["default"].createElement(_TextInputInnerVisualSlot, {
    visualPosition: "leading",
    showLoadingIndicator: showLeadingLoadingIndicator,
    hasLoadingIndicator: typeof loading === 'boolean'
  }, typeof LeadingVisual === 'function' ? /*#__PURE__*/React__default["default"].createElement(LeadingVisual, null) : LeadingVisual), /*#__PURE__*/React__default["default"].createElement(_UnstyledTextInput, _extends({
    ref: inputRef,
    disabled: disabled,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur
  }, inputProps, {
    "data-component": "input"
  })), /*#__PURE__*/React__default["default"].createElement(_TextInputInnerVisualSlot, {
    visualPosition: "trailing",
    showLoadingIndicator: showTrailingLoadingIndicator,
    hasLoadingIndicator: typeof loading === 'boolean'
  }, typeof TrailingVisual === 'function' ? /*#__PURE__*/React__default["default"].createElement(TrailingVisual, null) : TrailingVisual), trailingAction);
});
TextInput.defaultProps = {
  type: 'text',
  loaderPosition: 'auto'
};
TextInput.displayName = 'TextInput';
var TextInput$1 = Object.assign(TextInput, {
  Action: _TextInputInnerAction
});

module.exports = TextInput$1;
