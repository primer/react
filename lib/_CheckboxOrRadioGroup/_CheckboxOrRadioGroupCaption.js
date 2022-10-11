'use strict';

var React = require('react');
var Text = require('../Text.js');
var slots = require('./slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const CheckboxOrRadioGroupCaption = ({
  children,
  sx
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "Caption"
}, ({
  disabled,
  captionId
}) => /*#__PURE__*/React__default["default"].createElement(Text, {
  color: disabled ? 'fg.muted' : 'fg.subtle',
  fontSize: 1,
  id: captionId,
  sx: sx
}, children));

CheckboxOrRadioGroupCaption.displayName = "CheckboxOrRadioGroupCaption";
var CheckboxOrRadioGroupCaption$1 = CheckboxOrRadioGroupCaption;

module.exports = CheckboxOrRadioGroupCaption$1;
