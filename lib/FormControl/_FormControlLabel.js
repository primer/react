'use strict';

var React = require('react');
var _InputLabel = require('../_InputLabel.js');
var slots = require('./slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const FormControlLabel = ({
  children,
  htmlFor,
  id,
  visuallyHidden,
  sx
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "Label"
}, ({
  disabled,
  id: formControlId,
  required
}) => /*#__PURE__*/React__default["default"].createElement(_InputLabel, {
  htmlFor: htmlFor || formControlId,
  id: id,
  visuallyHidden: visuallyHidden,
  required: required,
  disabled: disabled,
  sx: sx
}, children));

FormControlLabel.displayName = "FormControlLabel";
var FormControlLabel$1 = FormControlLabel;

module.exports = FormControlLabel$1;
