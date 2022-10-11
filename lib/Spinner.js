'use strict';

var React = require('react');
var styled = require('styled-components');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const sizeMap = {
  small: '16px',
  medium: '32px',
  large: '64px'
};

function Spinner({
  size: sizeKey = 'medium',
  ...props
}) {
  const size = sizeMap[sizeKey];
  return /*#__PURE__*/React__default["default"].createElement("svg", _extends({
    height: size,
    width: size,
    viewBox: "0 0 16 16",
    fill: "none"
  }, props), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: "8",
    cy: "8",
    r: "7",
    stroke: "currentColor",
    strokeOpacity: "0.25",
    strokeWidth: "2",
    vectorEffect: "non-scaling-stroke"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M15 8a7.002 7.002 0 00-7-7",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    vectorEffect: "non-scaling-stroke"
  }));
}

Spinner.displayName = "Spinner";
const StyledSpinner = styled__default["default"](Spinner).withConfig({
  displayName: "Spinner__StyledSpinner",
  componentId: "sc-1dxfx1i-0"
})(["@keyframes rotate-keyframes{100%{transform:rotate(360deg);}}animation:rotate-keyframes 1s linear infinite;", ""], sx["default"]);
StyledSpinner.displayName = 'Spinner';
var Spinner$1 = StyledSpinner;

module.exports = Spinner$1;
