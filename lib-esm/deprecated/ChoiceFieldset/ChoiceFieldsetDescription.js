import React from 'react';
import { Slot } from './ChoiceFieldset.js';
import Text from '../../Text.js';

const ChoiceFieldsetDescription = ({
  children
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Description"
}, ({
  disabled
}) => /*#__PURE__*/React.createElement(Text, {
  color: disabled ? 'fg.muted' : 'fg.default',
  fontSize: 1
}, children));

ChoiceFieldsetDescription.displayName = "ChoiceFieldsetDescription";
var ChoiceFieldsetDescription$1 = ChoiceFieldsetDescription;

export { ChoiceFieldsetDescription$1 as default };
