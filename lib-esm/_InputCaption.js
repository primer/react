import React from 'react';
import Text from './Text.js';

const InputCaption = ({
  children,
  disabled,
  id,
  sx
}) => /*#__PURE__*/React.createElement(Text, {
  color: disabled ? 'fg.subtle' : 'fg.muted',
  display: "block",
  fontSize: 0,
  id: id,
  sx: sx
}, children);

InputCaption.displayName = "InputCaption";
var InputCaption$1 = InputCaption;

export { InputCaption$1 as default };
