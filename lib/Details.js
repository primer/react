'use strict';

var styled = require('styled-components');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Details = styled__default["default"].details.withConfig({
  displayName: "Details",
  componentId: "sc-1qhvasm-0"
})(["& > summary{list-style:none;}& > summary::-webkit-details-marker{display:none;}", ";"], sx["default"]);
Details.displayName = 'Details';
var Details$1 = Details;

module.exports = Details$1;
