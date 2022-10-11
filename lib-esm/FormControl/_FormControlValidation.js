import React from 'react';
import InputValidation from '../_InputValidation.js';
import { Slot } from './slots.js';

const FormControlValidation = ({
  children,
  variant,
  sx,
  id
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Validation"
}, ({
  validationMessageId
}) => /*#__PURE__*/React.createElement(InputValidation, {
  validationStatus: variant,
  id: id || validationMessageId,
  sx: sx
}, children));

FormControlValidation.displayName = "FormControlValidation";
var FormControlValidation$1 = FormControlValidation;

export { FormControlValidation$1 as default };
