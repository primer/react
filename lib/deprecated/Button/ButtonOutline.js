'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var ButtonBase = require('./ButtonBase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const ButtonOutline = styled__default["default"](ButtonBase).withConfig({
  displayName: "ButtonOutline",
  componentId: "sc-1o2yyuc-0"
})(["color:", ";border:1px solid ", ";background-color:", ";box-shadow:", ";&:hover{color:", ";background-color:", ";border-color:", ";box-shadow:", ";}&:focus{border-color:", ";box-shadow:", ";}&:active{color:", ";background-color:", ";box-shadow:", ";border-color:", ";}&:disabled{color:", ";background-color:", ";border-color:", ";}", ";"], constants.get('colors.btn.outline.text'), constants.get('colors.btn.border'), constants.get('colors.btn.bg'), constants.get('shadows.btn.shadow'), constants.get('colors.btn.outline.hoverText'), constants.get('colors.btn.outline.hoverBg'), constants.get('colors.btn.outline.hoverBorder'), constants.get('shadows.btn.outline.hoverShadow'), constants.get('colors.btn.outline.focusBorder'), constants.get('shadows.btn.outline.focusShadow'), constants.get('colors.btn.outline.selectedText'), constants.get('colors.btn.outline.selectedBg'), constants.get('shadows.btn.outline.selectedShadow'), constants.get('colors.btn.outline.selectedBorder'), constants.get('colors.btn.outline.disabledText'), constants.get('colors.btn.outline.disabledBg'), constants.get('colors.btn.border'), sx["default"]);
var ButtonOutline$1 = ButtonOutline;

module.exports = ButtonOutline$1;
