'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Text = styled__default["default"].span.withConfig({
  displayName: "Text",
  componentId: "sc-125xb1i-0"
})(["", ";", ";", ";"], constants.TYPOGRAPHY, constants.COMMON, sx["default"]);
var Text$1 = Text;

module.exports = Text$1;
