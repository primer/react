import React from 'react';
import InputCaption from '../_InputCaption.js';
import { Slot } from './slots.js';

const FormControlCaption = ({
  children,
  sx,
  id
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Caption"
}, ({
  captionId,
  disabled
}) => /*#__PURE__*/React.createElement(InputCaption, {
  id: id || captionId,
  disabled: disabled,
  sx: sx
}, children));

FormControlCaption.displayName = "FormControlCaption";
var FormControlCaption$1 = FormControlCaption;

export { FormControlCaption$1 as default };
