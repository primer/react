import React from 'react';
import InputLabel from '../../_InputLabel.js';
import { Slot } from './slots.js';

const InputFieldLabel = ({
  children,
  visuallyHidden
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Label"
}, ({
  disabled,
  id,
  required
}) => /*#__PURE__*/React.createElement(InputLabel, {
  htmlFor: id,
  visuallyHidden: visuallyHidden,
  required: required,
  disabled: disabled
}, children));

InputFieldLabel.displayName = "InputFieldLabel";
var InputFieldLabel$1 = InputFieldLabel;

export { InputFieldLabel$1 as default };
