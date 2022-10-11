'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var ButtonBase = require('./ButtonBase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

/** @deprecated Use the new Label instead. See https://primer.style/react/Button for more details. */

const Button = styled__default["default"](ButtonBase).withConfig({
  displayName: "Button",
  componentId: "sc-ybpnzh-0"
})(["color:", ";background-color:", ";border:1px solid ", ";box-shadow:", ",", "};&:hover{background-color:", ";border-color:", ";}&:focus{border-color:", ";box-shadow:", ";}&:active{background-color:", ";box-shadow:", ";}&:disabled{color:", ";background-color:", ";border-color:", ";}", ";"], constants.get('colors.btn.text'), constants.get('colors.btn.bg'), constants.get('colors.btn.border'), constants.get('shadows.btn.shadow'), constants.get('shadows.btn.insetShadow'), constants.get('colors.btn.hoverBg'), constants.get('colors.btn.hoverBorder'), constants.get('colors.btn.focusBorder'), constants.get('shadows.btn.focusShadow'), constants.get('colors.btn.selectedBg'), constants.get('shadows.btn.shadowActive'), constants.get('colors.primer.fg.disabled'), constants.get('colors.btn.bg'), constants.get('colors.btn.border'), sx["default"]);
var Button$1 = Button;

module.exports = Button$1;
