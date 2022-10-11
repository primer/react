'use strict';

var React = require('react');
var Box = require('../Box.js');
var _VisuallyHidden = require('../_VisuallyHidden.js');
var slots = require('./slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const CheckboxOrRadioGroupLabel = ({
  children,
  visuallyHidden,
  sx
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "Label"
}, ({
  required,
  disabled
}) => /*#__PURE__*/React__default["default"].createElement(_VisuallyHidden, {
  isVisible: !visuallyHidden,
  title: required ? 'required field' : undefined,
  sx: {
    display: 'block',
    color: disabled ? 'fg.muted' : undefined,
    fontSize: 2,
    ...sx
  }
}, required ? /*#__PURE__*/React__default["default"].createElement(Box, {
  display: "flex",
  as: "span"
}, /*#__PURE__*/React__default["default"].createElement(Box, {
  mr: 1
}, children), /*#__PURE__*/React__default["default"].createElement("span", null, "*")) : children));

CheckboxOrRadioGroupLabel.displayName = "CheckboxOrRadioGroupLabel";
CheckboxOrRadioGroupLabel.defaultProps = {
  visuallyHidden: false
};
var CheckboxOrRadioGroupLabel$1 = CheckboxOrRadioGroupLabel;

module.exports = CheckboxOrRadioGroupLabel$1;
