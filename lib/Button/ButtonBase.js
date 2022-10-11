'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Box = require('../Box.js');
require('../sx.js');
var ThemeProvider = require('../ThemeProvider.js');
var types = require('./types.js');
var styles = require('./styles.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const defaultSxProp = {};
const iconWrapStyles = {
  display: 'inline-block'
};
const trailingIconStyles = { ...iconWrapStyles,
  ml: 2
};
const ButtonBase = /*#__PURE__*/React.forwardRef(({
  children,
  as: Component = 'button',
  sx: sxProp = defaultSxProp,
  ...props
}, forwardedRef) => {
  const {
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    variant = 'default',
    size = 'medium'
  } = props;
  const {
    theme
  } = ThemeProvider.useTheme();
  const baseStyles = React.useMemo(() => {
    return merge__default["default"].all([styles.getButtonStyles(theme), styles.getSizeStyles(size, variant, false), styles.getVariantStyles(variant, theme)]);
  }, [theme, size, variant]);
  const sxStyles = React.useMemo(() => {
    return merge__default["default"](baseStyles, sxProp);
  }, [baseStyles, sxProp]);
  return /*#__PURE__*/React__default["default"].createElement(types.StyledButton, _extends({
    as: Component,
    sx: sxStyles
  }, props, {
    ref: forwardedRef
  }), LeadingIcon && /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    "data-component": "leadingIcon",
    sx: iconWrapStyles
  }, /*#__PURE__*/React__default["default"].createElement(LeadingIcon, null)), children && /*#__PURE__*/React__default["default"].createElement("span", {
    "data-component": "text"
  }, children), TrailingIcon && /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    "data-component": "trailingIcon",
    sx: trailingIconStyles
  }, /*#__PURE__*/React__default["default"].createElement(TrailingIcon, null)));
});

exports.ButtonBase = ButtonBase;
