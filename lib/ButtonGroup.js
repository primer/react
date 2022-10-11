'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const ButtonGroup = styled__default["default"].div.withConfig({
  displayName: "ButtonGroup",
  componentId: "sc-tk435v-0"
})(["display:inline-flex;vertical-align:middle;&& > *{position:relative;border-right-width:0;border-radius:0;:first-child{border-top-left-radius:", ";border-bottom-left-radius:", ";margin-right:0;}:not(:first-child){margin-left:0;margin-right:0;}:last-child{border-right-width:1px;border-top-right-radius:", ";border-bottom-right-radius:", ";}:focus,:active,:hover{border-right-width:1px;+ *{border-left-width:0;}}:focus,:active{z-index:1;}}", ";"], constants.get('radii.2'), constants.get('radii.2'), constants.get('radii.2'), constants.get('radii.2'), sx["default"]);
var ButtonGroup$1 = ButtonGroup;

module.exports = ButtonGroup$1;
