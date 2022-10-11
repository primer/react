'use strict';

var React = require('react');
var _InputLabel = require('../../_InputLabel.js');
var slots = require('./slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const InputFieldLabel = ({
  children,
  visuallyHidden
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "Label"
}, ({
  disabled,
  id,
  required
}) => /*#__PURE__*/React__default["default"].createElement(_InputLabel, {
  htmlFor: id,
  visuallyHidden: visuallyHidden,
  required: required,
  disabled: disabled
}, children));

InputFieldLabel.displayName = "InputFieldLabel";
var InputFieldLabel$1 = InputFieldLabel;

module.exports = InputFieldLabel$1;
