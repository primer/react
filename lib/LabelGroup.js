'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const LabelGroup = styled__default["default"].span.withConfig({
  displayName: "LabelGroup",
  componentId: "sc-1a0k7wh-0"
})(["& *{margin-right:", ";}& *:last-child{margin-right:0;}", ";"], constants.get('space.1'), sx["default"]);
var LabelGroup$1 = LabelGroup;

module.exports = LabelGroup$1;
