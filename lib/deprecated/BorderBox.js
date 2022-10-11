'use strict';

var styled = require('styled-components');
var Box = require('../Box.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

/**
 * @deprecated Use the Box component instead (i.e. <BorderBox> → <Box borderWidth='1px' borderStyle='solid' borderColor='border.primary' borderRadius={2}>)
 */
const BorderBox = styled__default["default"](Box).withConfig({
  displayName: "BorderBox",
  componentId: "sc-129byhp-0"
})([""]);
BorderBox.defaultProps = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.default',
  borderRadius: 2
};
var BorderBox$1 = BorderBox;

module.exports = BorderBox$1;
