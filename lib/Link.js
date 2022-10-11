'use strict';

var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const hoverColor = styledSystem.system({
  hoverColor: {
    property: 'color',
    scale: 'colors'
  }
});
const Link = styled__default["default"].a.withConfig({
  displayName: "Link",
  componentId: "sc-hrxz1n-0"
})(["color:", ";text-decoration:", ";&:hover{text-decoration:", ";", ";}&:is(button){display:inline-block;padding:0;font-size:inherit;white-space:nowrap;cursor:pointer;user-select:none;background-color:transparent;border:0;appearance:none;}", ";"], props => props.muted ? constants.get('colors.fg.muted')(props) : constants.get('colors.accent.fg')(props), props => props.underline ? 'underline' : 'none', props => props.muted ? 'none' : 'underline', props => props.hoverColor ? hoverColor : props.muted ? `color: ${constants.get('colors.accent.fg')(props)}` : '', sx["default"]);
var Link$1 = Link;

module.exports = Link$1;
