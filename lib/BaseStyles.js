'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('./constants.js');
var ThemeProvider = require('./ThemeProvider.js');
require('focus-visible');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GlobalStyle = styled.createGlobalStyle(["*{box-sizing:border-box;}body{margin:0;}table{border-collapse:collapse;}input{color-scheme:", ";}[role=\"button\"]:focus:not(:focus-visible):not(.focus-visible),[role=\"tabpanel\"][tabindex=\"0\"]:focus:not(:focus-visible):not(.focus-visible),button:focus:not(:focus-visible):not(.focus-visible),summary:focus:not(:focus-visible):not(.focus-visible),a:focus:not(:focus-visible):not(.focus-visible){outline:none;box-shadow:none;}[tabindex=\"0\"]:focus:not(:focus-visible):not(.focus-visible),details-dialog:focus:not(:focus-visible):not(.focus-visible){outline:none;}"], props => props.colorScheme);
const Base = styled__default["default"].div.withConfig({
  displayName: "BaseStyles__Base",
  componentId: "sc-nfjs56-0"
})(["", ";", ";"], constants.TYPOGRAPHY, constants.COMMON);

function BaseStyles(props) {
  const {
    children,
    ...rest
  } = props;
  const {
    colorScheme
  } = ThemeProvider.useTheme();
  return /*#__PURE__*/React__default["default"].createElement(Base, _extends({}, rest, {
    "data-portal-root": true
  }), /*#__PURE__*/React__default["default"].createElement(GlobalStyle, {
    colorScheme: colorScheme !== null && colorScheme !== void 0 && colorScheme.includes('dark') ? 'dark' : 'light'
  }), children);
}

BaseStyles.displayName = "BaseStyles";
BaseStyles.defaultProps = {
  color: 'fg.default',
  fontFamily: 'normal',
  lineHeight: 'default'
};

module.exports = BaseStyles;
