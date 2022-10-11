'use strict';

var React = require('react');
var _InputValidation = require('../_InputValidation.js');
var slots = require('./slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const CheckboxOrRadioGroupValidation = ({
  children,
  variant,
  sx
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "Validation"
}, ({
  validationMessageId = ''
}) => /*#__PURE__*/React__default["default"].createElement(_InputValidation, {
  validationStatus: variant,
  id: validationMessageId,
  sx: sx
}, children));

CheckboxOrRadioGroupValidation.displayName = "CheckboxOrRadioGroupValidation";
var CheckboxOrRadioGroupValidation$1 = CheckboxOrRadioGroupValidation;

module.exports = CheckboxOrRadioGroupValidation$1;
