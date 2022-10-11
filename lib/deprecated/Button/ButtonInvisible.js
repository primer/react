'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var ButtonBase = require('./ButtonBase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const ButtonInvisible = styled__default["default"](ButtonBase).withConfig({
  displayName: "ButtonInvisible",
  componentId: "sc-cy3rd6-0"
})(["color:", ";background-color:transparent;border:0;border-radius:", ";box-shadow:none;&:disabled{color:", ";}&:focus{box-shadow:", ";}&:hover{background-color:", ";}&:active{background-color:", ";}", ""], constants.get('colors.accent.fg'), constants.get('radii.2'), constants.get('colors.primer.fg.disabled'), constants.get('shadows.btn.focusShadow'), constants.get('colors.btn.hoverBg'), constants.get('colors.btn.selectedBg'), sx["default"]);
var ButtonInvisible$1 = ButtonInvisible;

module.exports = ButtonInvisible$1;
