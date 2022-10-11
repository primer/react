'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const listStyles = styled.css(["position:relative;padding:0;margin:0;flex:auto;overflow-x:hidden;overflow-y:auto;background-color:", ";-webkit-overflow-scrolling:touch;@media (hover:hover){.SelectMenuTab:focus{background-color:", ";}.SelectMenuTab:not([aria-checked='true']):hover{color:", ";background-color:", ";}.SelectMenuTab:not([aria-checked='true']):active{color:", ";background-color:", ";}}"], constants.get('colors.canvas.overlay'), constants.get('colors.selectMenu.tapFocusBg'), constants.get('colors.fg.default'), constants.get('colors.canvas.subtle'), constants.get('colors.fg.default'), constants.get('colors.canvas.subtle'));
const SelectMenuList = styled__default["default"].div.withConfig({
  displayName: "SelectMenuList",
  componentId: "sc-lbozs8-0"
})(["", " ", ";"], listStyles, sx["default"]);
SelectMenuList.displayName = 'SelectMenu.List';
var SelectMenuList$1 = SelectMenuList;

module.exports = SelectMenuList$1;
