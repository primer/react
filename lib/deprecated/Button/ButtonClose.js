'use strict';

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledButton = styled__default["default"].button.withConfig({
  displayName: "ButtonClose__StyledButton",
  componentId: "sc-azdk6r-0"
})(["border:none;padding:0;background:transparent;outline:none;cursor:pointer;border-radius:", ";color:", ";&:focus{box-shadow:", ";}&:hover{color:", ";}", ";"], constants.get('radii.2'), constants.get('colors.fg.muted'), constants.get('shadows.btn.focusShadow'), constants.get('colors.accent.fg'), sx["default"]);
const ButtonClose = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(StyledButton, _extends({
    ref: ref,
    "aria-label": "Close"
  }, props), /*#__PURE__*/React__default["default"].createElement(octiconsReact.XIcon, null));
});
var ButtonClose$1 = ButtonClose;

module.exports = ButtonClose$1;
