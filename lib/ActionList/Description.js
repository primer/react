'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Box = require('../Box.js');
require('@styled-system/css');
var merge = require('deepmerge');
var Truncate = require('../Truncate.js');
var shared = require('./shared.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

const Description = ({
  variant = 'inline',
  sx = {},
  ...props
}) => {
  const styles = {
    fontSize: 0,
    lineHeight: '16px',
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
    marginLeft: variant === 'block' ? 0 : 2
  };
  return /*#__PURE__*/React__default["default"].createElement(shared.Slot, {
    name: variant === 'block' ? 'BlockDescription' : 'InlineDescription'
  }, ({
    blockDescriptionId,
    inlineDescriptionId,
    disabled
  }) => variant === 'block' ? /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    sx: merge__default["default"]({ ...styles,
      color: disabled ? 'fg.disabled' : 'fg.muted'
    }, sx),
    id: blockDescriptionId
  }, props.children) : /*#__PURE__*/React__default["default"].createElement(Truncate, {
    id: inlineDescriptionId,
    sx: merge__default["default"]({ ...styles,
      color: disabled ? 'fg.disabled' : 'fg.muted'
    }, sx),
    title: props.children,
    inline: true,
    maxWidth: "100%"
  }, props.children));
};
Description.displayName = "Description";

exports.Description = Description;
