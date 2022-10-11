import React from 'react';
import InputValidation from '../_InputValidation.js';
import { Slot } from './slots.js';

const CheckboxOrRadioGroupValidation = ({
  children,
  variant,
  sx
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Validation"
}, ({
  validationMessageId = ''
}) => /*#__PURE__*/React.createElement(InputValidation, {
  validationStatus: variant,
  id: validationMessageId,
  sx: sx
}, children));

CheckboxOrRadioGroupValidation.displayName = "CheckboxOrRadioGroupValidation";
var CheckboxOrRadioGroupValidation$1 = CheckboxOrRadioGroupValidation;

export { CheckboxOrRadioGroupValidation$1 as default };
