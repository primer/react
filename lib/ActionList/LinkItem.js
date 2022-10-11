'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Link = require('../Link.js');
require('@styled-system/css');
var merge = require('deepmerge');
var Item = require('./Item.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const LinkItem = /*#__PURE__*/React__default["default"].forwardRef(({
  sx = {},
  active,
  as: Component,
  ...props
}, forwardedRef) => {
  const styles = {
    // occupy full size of Item
    paddingX: 2,
    paddingY: '6px',
    // custom value off the scale
    display: 'flex',
    flexGrow: 1,
    // full width
    borderRadius: 2,
    // inherit Item styles
    color: 'inherit',
    '&:hover': {
      color: 'inherit',
      textDecoration: 'none'
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(Item.Item, {
    active: active,
    sx: {
      paddingY: 0,
      paddingX: 0
    },
    _PrivateItemWrapper: ({
      children
    }) => /*#__PURE__*/React__default["default"].createElement(Link, _extends({
      as: Component,
      sx: merge__default["default"](styles, sx)
    }, props, {
      ref: forwardedRef
    }), children)
  }, props.children);
});

exports.LinkItem = LinkItem;
