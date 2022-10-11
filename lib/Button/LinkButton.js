'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
require('../sx.js');
var ButtonBase = require('./ButtonBase.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const LinkButton = /*#__PURE__*/React.forwardRef(({
  children,
  as: Component = 'a',
  sx = {},
  ...props
}, forwardedRef) => {
  const style = {
    width: 'fit-content',
    '&:hover:not([disabled])': {
      textDecoration: 'underline'
    },
    // focus must come before :active so that the active box shadow overrides
    '&:focus:not([disabled])': {
      textDecoration: 'underline'
    },
    '&:active:not([disabled])': {
      textDecoration: 'underline'
    }
  };
  const sxStyle = merge__default["default"].all([style, sx]);
  return /*#__PURE__*/React__default["default"].createElement(ButtonBase.ButtonBase, _extends({
    as: Component,
    ref: forwardedRef,
    sx: sxStyle
  }, props), children);
});

exports.LinkButton = LinkButton;
