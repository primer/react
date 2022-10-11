'use strict';

var React = require('react');
var styled = require('styled-components');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function Octicon({
  icon: IconComponent,
  ...rest
}) {
  return /*#__PURE__*/React__default["default"].createElement(IconComponent, rest);
}

Octicon.displayName = "Octicon";
const StyledOcticon = styled__default["default"](Octicon).withConfig({
  displayName: "StyledOcticon",
  componentId: "sc-1lhyyr-0"
})(["", ""], ({
  color,
  sx: sxProp
}) => sx["default"]({
  sx: {
    color,
    ...sxProp
  }
}));
StyledOcticon.defaultProps = {
  size: 16
};
var StyledOcticon$1 = StyledOcticon;

module.exports = StyledOcticon$1;
