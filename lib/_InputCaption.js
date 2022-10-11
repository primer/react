'use strict';

var React = require('react');
var Text = require('./Text.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const InputCaption = ({
  children,
  disabled,
  id,
  sx
}) => /*#__PURE__*/React__default["default"].createElement(Text, {
  color: disabled ? 'fg.subtle' : 'fg.muted',
  display: "block",
  fontSize: 0,
  id: id,
  sx: sx
}, children);

InputCaption.displayName = "InputCaption";
var InputCaption$1 = InputCaption;

module.exports = InputCaption$1;
