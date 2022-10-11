'use strict';

var React = require('react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Bar = styled__default["default"].span.withConfig({
  displayName: "ProgressBar__Bar",
  componentId: "sc-bfftmc-0"
})(["width:", ";", ";"], props => props.progress ? `${props.progress}%` : 0, sx["default"]);
const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px'
};
const ProgressContainer = styled__default["default"].span.withConfig({
  displayName: "ProgressBar__ProgressContainer",
  componentId: "sc-bfftmc-1"
})(["display:", ";overflow:hidden;background-color:", ";border-radius:", ";height:", ";", " ", ";"], props => props.inline ? 'inline-flex' : 'flex', constants.get('colors.border.default'), constants.get('radii.1'), props => sizeMap[props.barSize || 'default'], styledSystem.width, sx["default"]);

function ProgressBar({
  progress,
  bg,
  ...rest
}) {
  return /*#__PURE__*/React__default["default"].createElement(ProgressContainer, rest, /*#__PURE__*/React__default["default"].createElement(Bar, {
    progress: progress,
    sx: {
      bg
    }
  }));
}

ProgressBar.displayName = "ProgressBar";
ProgressBar.defaultProps = {
  bg: 'success.emphasis',
  barSize: 'default'
};

module.exports = ProgressBar;
