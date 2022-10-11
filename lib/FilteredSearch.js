'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const FilteredSearch = styled__default["default"].div.withConfig({
  displayName: "FilteredSearch",
  componentId: "sc-1q2r5fr-0"
})(["display:flex;align-items:stretch;summary,> button{border-radius:0;border-top-left-radius:", ";border-bottom-left-radius:", ";border-right:0;}.TextInput-wrapper{border-radius:0;border-top-right-radius:", ";border-bottom-right-radius:", ";}", ""], constants.get('radii.2'), constants.get('radii.2'), constants.get('radii.2'), constants.get('radii.2'), sx["default"]);
var FilteredSearch$1 = FilteredSearch;

module.exports = FilteredSearch$1;
