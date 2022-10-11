'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var ButtonBase = require('./ButtonBase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const ButtonDanger = styled__default["default"](ButtonBase).withConfig({
  displayName: "ButtonDanger",
  componentId: "sc-j9bmd7-0"
})(["color:", ";border:1px solid ", ";background-color:", ";box-shadow:", ";&:hover{color:", ";background-color:", ";border-color:", ";box-shadow:", ";}&:focus{border-color:", ";box-shadow:", ";}&:active{color:", ";background-color:", ";box-shadow:", ";border-color:", ";}&:disabled{color:", ";background-color:", ";border-color:", ";}", ";"], constants.get('colors.btn.danger.text'), constants.get('colors.btn.border'), constants.get('colors.btn.bg'), constants.get('shadows.btn.shadow'), constants.get('colors.btn.danger.hoverText'), constants.get('colors.btn.danger.hoverBg'), constants.get('colors.btn.danger.hoverBorder'), constants.get('shadows.btn.danger.hoverShadow'), constants.get('colors.btn.danger.focusBorder'), constants.get('shadows.btn.danger.focusShadow'), constants.get('colors.btn.danger.selectedText'), constants.get('colors.btn.danger.selectedBg'), constants.get('shadows.btn.danger.selectedShadow'), constants.get('colors.btn.danger.selectedBorder'), constants.get('colors.btn.danger.disabledText'), constants.get('colors.btn.danger.disabledBg'), constants.get('colors.btn.danger.disabledBorder'), sx["default"]);
var ButtonDanger$1 = ButtonDanger;

module.exports = ButtonDanger$1;
