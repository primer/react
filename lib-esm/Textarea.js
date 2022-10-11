import styled, { css } from 'styled-components';
import React from 'react';
import { TextInputBaseWrapper } from './_TextInputWrapper.js';
import sx from './sx.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DEFAULT_TEXTAREA_ROWS = 7;
const DEFAULT_TEXTAREA_COLS = 30;
const DEFAULT_TEXTAREA_RESIZE = 'both';
const StyledTextarea = styled.textarea.withConfig({
  displayName: "Textarea__StyledTextarea",
  componentId: "sc-wz5skc-0"
})(["border:0;font-size:inherit;font-family:inherit;background-color:transparent;-webkit-appearance:none;color:inherit;width:100%;resize:both;&:focus{outline:0;}", " ", " ", ";"], props => props.resize && css(["resize:", ";"], props.resize), props => props.disabled && css(["resize:none;"]), sx);
/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */

const Textarea = /*#__PURE__*/React.forwardRef(({
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
  return /*#__PURE__*/React.createElement(TextInputBaseWrapper, {
    sx: sxProp,
    validationStatus: validationStatus,
    disabled: disabled,
    block: block
  }, /*#__PURE__*/React.createElement(StyledTextarea, _extends({
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

export { DEFAULT_TEXTAREA_COLS, DEFAULT_TEXTAREA_RESIZE, DEFAULT_TEXTAREA_ROWS, Textarea as default };
