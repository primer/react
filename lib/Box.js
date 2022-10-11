'use strict';

var styled = require('styled-components');
var styledSystem = require('styled-system');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Box = styled__default["default"].div.withConfig({
  displayName: "Box",
  componentId: "sc-1gh2r6s-0"
})(styledSystem.space, styledSystem.color, styledSystem.typography, styledSystem.layout, styledSystem.flexbox, styledSystem.grid, styledSystem.background, styledSystem.border, styledSystem.position, styledSystem.shadow, sx["default"]);
var Box$1 = Box;

module.exports = Box$1;
