'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var ButtonBase = require('./ButtonBase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const ButtonPrimary = styled__default["default"](ButtonBase).withConfig({
  displayName: "ButtonPrimary",
  componentId: "sc-1awfvt4-0"
})(["color:", ";border:1px solid ", ";background-color:", ";box-shadow:", ";&:hover{color:", ";background-color:", ";border-color:", ";box-shadow:", ";}&:focus{border-color:", ";box-shadow:", ";}&:active{background-color:", ";box-shadow:", ";}&:disabled{color:", ";background-color:", ";border-color:", ";}", ";"], constants.get('colors.btn.primary.text'), constants.get('colors.btn.primary.border'), constants.get('colors.btn.primary.bg'), constants.get('shadows.btn.primary.shadow'), constants.get('colors.btn.primary.hoverText'), constants.get('colors.btn.primary.hoverBg'), constants.get('colors.btn.primary.hoverBorder'), constants.get('shadows.btn.primary.hoverShadow'), constants.get('colors.btn.primary.focusBorder'), constants.get('shadows.btn.primary.focusShadow'), constants.get('colors.btn.primary.selectedBg'), constants.get('shadows.btn.primary.selectedShadow'), constants.get('colors.btn.primary.disabledText'), constants.get('colors.btn.primary.disabledBg'), constants.get('colors.btn.primary.disabledBorder'), sx["default"]);
var ButtonPrimary$1 = ButtonPrimary;

exports.ButtonPrimary = ButtonPrimary;
exports["default"] = ButtonPrimary$1;
