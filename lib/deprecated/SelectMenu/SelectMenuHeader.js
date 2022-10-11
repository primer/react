'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// SelectMenu.Header is intentionally not exported, it's an internal component used in
// SelectMenu.Modal
const SelectMenuTitle = styled__default["default"].h3.withConfig({
  displayName: "SelectMenuHeader__SelectMenuTitle",
  componentId: "sc-168btih-0"
})(["color:", ";flex:auto;font-size:", ";font-weight:", ";margin:0;@media (min-width:", "){font-size:inherit;}"], constants.get('colors.fg.default'), constants.get('fontSizes.1'), constants.get('fontWeights.bold'), constants.get('breakpoints.0'));
const StyledHeader = styled__default["default"].header.withConfig({
  displayName: "SelectMenuHeader__StyledHeader",
  componentId: "sc-168btih-1"
})(["display:flex;flex:none;padding:", ";border-bottom:", " solid ", ";@media (min-width:", "){padding-top:", ";padding-bottom:", ";}", ";"], constants.get('space.3'), constants.get('borderWidths'), constants.get('colors.border.muted'), constants.get('breakpoints.0'), constants.get('space.2'), constants.get('space.2'), sx["default"]);

const SelectMenuHeader = ({
  children,
  theme,
  ...rest
}) => {
  return /*#__PURE__*/React__default["default"].createElement(StyledHeader, _extends({
    theme: theme
  }, rest), /*#__PURE__*/React__default["default"].createElement(SelectMenuTitle, {
    theme: theme
  }, children));
};

SelectMenuHeader.displayName = "SelectMenuHeader";
SelectMenuHeader.displayName = 'SelectMenu.Header';
var SelectMenuHeader$1 = SelectMenuHeader;

module.exports = SelectMenuHeader$1;
