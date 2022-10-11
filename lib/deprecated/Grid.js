'use strict';

var styled = require('styled-components');
var Box = require('../Box.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

/**
 * @deprecated Use the Box component instead (i.e. <Grid> → <Box display="grid">)
 */
const Grid = styled__default["default"](Box).withConfig({
  displayName: "Grid",
  componentId: "sc-166tpao-0"
})([""]);
Grid.defaultProps = {
  display: 'grid'
};
var Grid$1 = Grid;

module.exports = Grid$1;
