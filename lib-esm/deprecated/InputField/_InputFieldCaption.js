import React from 'react';
import InputCaption from '../../_InputCaption.js';
import { Slot } from './slots.js';

const InputFieldCaption = ({
  children
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Caption"
}, ({
  captionId,
  disabled
}) => /*#__PURE__*/React.createElement(InputCaption, {
  id: captionId,
  disabled: disabled
}, children));

InputFieldCaption.displayName = "InputFieldCaption";
var InputFieldCaption$1 = InputFieldCaption;

export { InputFieldCaption$1 as default };
