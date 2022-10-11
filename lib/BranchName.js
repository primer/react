'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const BranchName = styled__default["default"].a.withConfig({
  displayName: "BranchName",
  componentId: "sc-lduqme-0"
})(["display:inline-block;padding:2px 6px;font-size:", ";font-family:", ";color:", ";background-color:", ";border-radius:", ";text-decoration:none;", ";"], constants.get('fontSizes.0'), constants.get('fonts.mono'), constants.get('colors.accent.fg'), constants.get('colors.accent.subtle'), constants.get('radii.2'), sx["default"]);
var BranchName$1 = BranchName;

module.exports = BranchName$1;
