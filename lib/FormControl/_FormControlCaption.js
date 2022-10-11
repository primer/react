'use strict';

var React = require('react');
var _InputCaption = require('../_InputCaption.js');
var slots = require('./slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const FormControlCaption = ({
  children,
  sx,
  id
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "Caption"
}, ({
  captionId,
  disabled
}) => /*#__PURE__*/React__default["default"].createElement(_InputCaption, {
  id: id || captionId,
  disabled: disabled,
  sx: sx
}, children));

FormControlCaption.displayName = "FormControlCaption";
var FormControlCaption$1 = FormControlCaption;

module.exports = FormControlCaption$1;
