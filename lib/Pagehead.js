'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Pagehead = styled__default["default"].div.withConfig({
  displayName: "Pagehead",
  componentId: "sc-17d52hr-0"
})(["position:relative;padding-top:", ";padding-bottom:", ";margin-bottom:", ";border-bottom:1px solid ", ";", ";"], constants.get('space.4'), constants.get('space.4'), constants.get('space.4'), constants.get('colors.border.default'), sx["default"]);
var Pagehead$1 = Pagehead;

module.exports = Pagehead$1;
