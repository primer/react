'use strict';

var React = require('react');
var ChoiceFieldset = require('./ChoiceFieldset.js');
var Text = require('../../Text.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const ChoiceFieldsetDescription = ({
  children
}) => /*#__PURE__*/React__default["default"].createElement(ChoiceFieldset.Slot, {
  name: "Description"
}, ({
  disabled
}) => /*#__PURE__*/React__default["default"].createElement(Text, {
  color: disabled ? 'fg.muted' : 'fg.default',
  fontSize: 1
}, children));

ChoiceFieldsetDescription.displayName = "ChoiceFieldsetDescription";
var ChoiceFieldsetDescription$1 = ChoiceFieldsetDescription;

module.exports = ChoiceFieldsetDescription$1;
