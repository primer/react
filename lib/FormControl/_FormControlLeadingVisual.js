'use strict';

var React = require('react');
var Box = require('../Box.js');
var constants = require('../constants.js');
var slots = require('./slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const FormControlLeadingVisual = ({
  children,
  sx
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "LeadingVisual"
}, ({
  disabled,
  captionId
}) => /*#__PURE__*/React__default["default"].createElement(Box, {
  color: disabled ? 'fg.muted' : 'fg.default',
  sx: {
    '> *': {
      minWidth: captionId ? constants.get('fontSizes.4') : constants.get('fontSizes.2'),
      minHeight: captionId ? constants.get('fontSizes.4') : constants.get('fontSizes.2'),
      fill: 'currentColor'
    },
    ...sx
  },
  ml: 2
}, children));

FormControlLeadingVisual.displayName = "FormControlLeadingVisual";
var FormControlLeadingVisual$1 = FormControlLeadingVisual;

module.exports = FormControlLeadingVisual$1;
