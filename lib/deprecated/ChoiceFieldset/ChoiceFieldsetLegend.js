'use strict';

var React = require('react');
var _VisuallyHidden = require('../../_VisuallyHidden.js');
var ChoiceFieldset = require('./ChoiceFieldset.js');
var Box = require('../../Box.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const ChoiceFieldsetLegend = ({
  children,
  visuallyHidden
}) => /*#__PURE__*/React__default["default"].createElement(ChoiceFieldset.Slot, {
  name: "Legend"
}, ({
  required,
  disabled
}) => /*#__PURE__*/React__default["default"].createElement(_VisuallyHidden, {
  as: "legend",
  isVisible: !visuallyHidden,
  title: required ? 'required field' : undefined,
  sx: {
    color: disabled ? 'fg.muted' : undefined,
    fontSize: 2,
    padding: 0
  }
}, required ? /*#__PURE__*/React__default["default"].createElement(Box, {
  display: "flex",
  as: "span"
}, /*#__PURE__*/React__default["default"].createElement(Box, {
  mr: 1
}, children), /*#__PURE__*/React__default["default"].createElement("span", null, "*")) : children));

ChoiceFieldsetLegend.displayName = "ChoiceFieldsetLegend";
var ChoiceFieldsetLegend$1 = ChoiceFieldsetLegend;

module.exports = ChoiceFieldsetLegend$1;
