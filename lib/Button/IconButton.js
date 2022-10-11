'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
require('../sx.js');
var ThemeProvider = require('../ThemeProvider.js');
var Box = require('../Box.js');
var types = require('./types.js');
var styles = require('./styles.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const IconButton = /*#__PURE__*/React.forwardRef((props, forwardedRef) => {
  const {
    variant = 'default',
    size = 'medium',
    sx: sxProp = {},
    icon: Icon,
    ...rest
  } = props;
  const {
    theme
  } = ThemeProvider.useTheme();
  const sxStyles = merge__default["default"].all([styles.getBaseStyles(theme), styles.getSizeStyles(size, variant, true), styles.getVariantStyles(variant, theme), sxProp]);
  return /*#__PURE__*/React__default["default"].createElement(types.StyledButton, _extends({
    sx: sxStyles
  }, rest, {
    ref: forwardedRef
  }), /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    sx: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React__default["default"].createElement(Icon, null)));
});

exports.IconButton = IconButton;
