'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Heading = styled__default["default"].h2.withConfig({
  displayName: "Heading",
  componentId: "sc-1irtotl-0"
})(["font-weight:", ";font-size:", ";margin:0;", ";"], constants.get('fontWeights.bold'), constants.get('fontSizes.5'), sx["default"]);
var Heading$1 = Heading;

module.exports = Heading$1;
