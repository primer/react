'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * Contract for props passed to the `Header` component.
 */

const StyledHeader = styled__default["default"].div.withConfig({
  displayName: "Header__StyledHeader",
  componentId: "sc-cjezay-0"
})(["{}padding:6px ", ";font-size:", ";font-weight:", ";color:", ";", " ", ""], constants.get('space.3'), constants.get('fontSizes.0'), constants.get('fontWeights.bold'), constants.get('colors.fg.muted'), ({
  variant
}) => variant === 'filled' && styled.css(["background:", ";margin:", " 0;border-top:1px solid ", ";border-bottom:1px solid ", ";&:first-child{margin-top:0;}"], constants.get('colors.canvas.subtle'), constants.get('space.2'), constants.get('colors.neutral.muted'), constants.get('colors.neutral.muted')), sx["default"]);
/**
 * Displays the name and description of a `Group`.
 */

function Header({
  variant = 'subtle',
  title,
  auxiliaryText,
  children: _children,
  ...props
}) {
  return /*#__PURE__*/React__default["default"].createElement(StyledHeader, _extends({
    role: "heading",
    variant: variant
  }, props), title, auxiliaryText && /*#__PURE__*/React__default["default"].createElement("span", null, auxiliaryText));
}
Header.displayName = "Header";

exports.Header = Header;
exports.StyledHeader = StyledHeader;
