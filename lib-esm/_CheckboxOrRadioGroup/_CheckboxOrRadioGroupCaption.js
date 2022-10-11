import React from 'react';
import Text from '../Text.js';
import { Slot } from './slots.js';

const CheckboxOrRadioGroupCaption = ({
  children,
  sx
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Caption"
}, ({
  disabled,
  captionId
}) => /*#__PURE__*/React.createElement(Text, {
  color: disabled ? 'fg.muted' : 'fg.subtle',
  fontSize: 1,
  id: captionId,
  sx: sx
}, children));

CheckboxOrRadioGroupCaption.displayName = "CheckboxOrRadioGroupCaption";
var CheckboxOrRadioGroupCaption$1 = CheckboxOrRadioGroupCaption;

export { CheckboxOrRadioGroupCaption$1 as default };
