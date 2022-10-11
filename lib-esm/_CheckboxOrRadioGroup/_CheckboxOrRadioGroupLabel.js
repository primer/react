import React from 'react';
import Box from '../Box.js';
import VisuallyHidden from '../_VisuallyHidden.js';
import { Slot } from './slots.js';

const CheckboxOrRadioGroupLabel = ({
  children,
  visuallyHidden,
  sx
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Label"
}, ({
  required,
  disabled
}) => /*#__PURE__*/React.createElement(VisuallyHidden, {
  isVisible: !visuallyHidden,
  title: required ? 'required field' : undefined,
  sx: {
    display: 'block',
    color: disabled ? 'fg.muted' : undefined,
    fontSize: 2,
    ...sx
  }
}, required ? /*#__PURE__*/React.createElement(Box, {
  display: "flex",
  as: "span"
}, /*#__PURE__*/React.createElement(Box, {
  mr: 1
}, children), /*#__PURE__*/React.createElement("span", null, "*")) : children));

CheckboxOrRadioGroupLabel.displayName = "CheckboxOrRadioGroupLabel";
CheckboxOrRadioGroupLabel.defaultProps = {
  visuallyHidden: false
};
var CheckboxOrRadioGroupLabel$1 = CheckboxOrRadioGroupLabel;

export { CheckboxOrRadioGroupLabel$1 as default };
