import React from 'react';
import Box from '../Box.js';
import { get } from '../constants.js';
import { Slot } from './slots.js';

const FormControlLeadingVisual = ({
  children,
  sx
}) => /*#__PURE__*/React.createElement(Slot, {
  name: "LeadingVisual"
}, ({
  disabled,
  captionId
}) => /*#__PURE__*/React.createElement(Box, {
  color: disabled ? 'fg.muted' : 'fg.default',
  sx: {
    '> *': {
      minWidth: captionId ? get('fontSizes.4') : get('fontSizes.2'),
      minHeight: captionId ? get('fontSizes.4') : get('fontSizes.2'),
      fill: 'currentColor'
    },
    ...sx
  },
  ml: 2
}, children));

FormControlLeadingVisual.displayName = "FormControlLeadingVisual";
var FormControlLeadingVisual$1 = FormControlLeadingVisual;

export { FormControlLeadingVisual$1 as default };
