'use strict';

var React = require('react');
var _InputCaption = require('../../_InputCaption.js');
var slots = require('./slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const InputFieldCaption = ({
  children
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "Caption"
}, ({
  captionId,
  disabled
}) => /*#__PURE__*/React__default["default"].createElement(_InputCaption, {
  id: captionId,
  disabled: disabled
}, children));

InputFieldCaption.displayName = "InputFieldCaption";
var InputFieldCaption$1 = InputFieldCaption;

module.exports = InputFieldCaption$1;
