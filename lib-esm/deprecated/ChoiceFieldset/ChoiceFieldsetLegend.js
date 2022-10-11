import React from 'react';
import VisuallyHidden from '../../_VisuallyHidden.js';
import { Slot } from './ChoiceFieldset.js';
import Box from '../../Box.js';

const ChoiceFieldsetLegend = ({
  children,
  visuallyHidden
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "Legend"
}, ({
  required,
  disabled
}) => /*#__PURE__*/React.createElement(VisuallyHidden, {
  as: "legend",
  isVisible: !visuallyHidden,
  title: required ? 'required field' : undefined,
  sx: {
    color: disabled ? 'fg.muted' : undefined,
    fontSize: 2,
    padding: 0
  }
}, required ? /*#__PURE__*/React.createElement(Box, {
  display: "flex",
  as: "span"
}, /*#__PURE__*/React.createElement(Box, {
  mr: 1
}, children), /*#__PURE__*/React.createElement("span", null, "*")) : children));

ChoiceFieldsetLegend.displayName = "ChoiceFieldsetLegend";
var ChoiceFieldsetLegend$1 = ChoiceFieldsetLegend;

export { ChoiceFieldsetLegend$1 as default };
