'use strict';

var styled = require('styled-components');
var Box = require('../Box.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

/**
 * @deprecated Use the Box component instead (i.e. <Flex> → <Box display="flex">)
 */
const Flex = styled__default["default"](Box).withConfig({
  displayName: "Flex",
  componentId: "sc-1vv09sz-0"
})([""]);
Flex.defaultProps = {
  display: 'flex'
};
var Flex$1 = Flex;

module.exports = Flex$1;
