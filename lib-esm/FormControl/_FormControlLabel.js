import React from 'react';
import InputLabel from '../_InputLabel.js';
import { Slot } from './slots.js';

const FormControlLabel = ({
  children,
  htmlFor,
  id,
  visuallyHidden,
  sx
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Label"
}, ({
  disabled,
  id: formControlId,
  required
}) => /*#__PURE__*/React.createElement(InputLabel, {
  htmlFor: htmlFor || formControlId,
  id: id,
  visuallyHidden: visuallyHidden,
  required: required,
  disabled: disabled,
  sx: sx
}, children));

FormControlLabel.displayName = "FormControlLabel";
var FormControlLabel$1 = FormControlLabel;

export { FormControlLabel$1 as default };
