'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styled = require('styled-components');
var React = require('react');
var _TextInputWrapper = require('./_TextInputWrapper.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DEFAULT_TEXTAREA_ROWS = 7;
const DEFAULT_TEXTAREA_COLS = 30;
const DEFAULT_TEXTAREA_RESIZE = 'both';
const StyledTextarea = styled__default["default"].textarea.withConfig({
  displayName: "Textarea__StyledTextarea",
  componentId: "sc-wz5skc-0"
})(["border:0;font-size:inherit;font-family:inherit;background-color:transparent;-webkit-appearance:none;color:inherit;width:100%;resize:both;&:focus{outline:0;}", " ", " ", ";"], props => props.resize && styled.css(["resize:", ";"], props.resize), props => props.disabled && styled.css(["resize:none;"]), sx["default"]);
/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */

const Textarea = /*#__PURE__*/React__default["default"].forwardRef(({
  value,
  disabled,
  sx: sxProp,
  required,
  validationStatus,
  rows = DEFAULT_TEXTAREA_ROWS,
  cols = DEFAULT_TEXTAREA_COLS,
  resize = DEFAULT_TEXTAREA_RESIZE,
  block,
  ...rest
}, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(_TextInputWrapper.TextInputBaseWrapper, {
    sx: sxProp,
    validationStatus: validationStatus,
    disabled: disabled,
    block: block
  }, /*#__PURE__*/React__default["default"].createElement(StyledTextarea, _extends({
    value: value,
    resize: resize,
    required: required,
    "aria-required": required ? 'true' : 'false',
    "aria-invalid": validationStatus === 'error' ? 'true' : 'false',
    ref: ref,
    disabled: disabled,
    rows: rows,
    cols: cols
  }, rest)));
});
Textarea.displayName = 'Textarea';

exports.DEFAULT_TEXTAREA_COLS = DEFAULT_TEXTAREA_COLS;
exports.DEFAULT_TEXTAREA_RESIZE = DEFAULT_TEXTAREA_RESIZE;
exports.DEFAULT_TEXTAREA_ROWS = DEFAULT_TEXTAREA_ROWS;
exports["default"] = Textarea;
