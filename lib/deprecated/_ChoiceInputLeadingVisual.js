'use strict';

var React = require('react');
var slots = require('./InputField/slots.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const ChoiceInputLeadingVisual = ({
  children
}) => /*#__PURE__*/React__default["default"].createElement(slots.Slot, {
  name: "LeadingVisual"
}, children);

ChoiceInputLeadingVisual.displayName = "ChoiceInputLeadingVisual";
var ChoiceInputLeadingVisual$1 = ChoiceInputLeadingVisual;

module.exports = ChoiceInputLeadingVisual$1;
