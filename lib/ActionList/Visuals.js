'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Box = require('../Box.js');
require('@styled-system/css');
var merge = require('deepmerge');
var constants = require('../constants.js');
var shared = require('./shared.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const LeadingVisualContainer = ({
  sx = {},
  ...props
}) => {
  return /*#__PURE__*/React__default["default"].createElement(Box, _extends({
    as: "span",
    sx: merge__default["default"]({
      height: shared.TEXT_ROW_HEIGHT,
      // match height of text row
      minWidth: constants.get('space.3'),
      maxWidth: shared.TEXT_ROW_HEIGHT,
      // square (same as height)
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      marginRight: 2
    }, sx)
  }, props));
};
LeadingVisualContainer.displayName = "LeadingVisualContainer";
const LeadingVisual = ({
  sx = {},
  ...props
}) => {
  return /*#__PURE__*/React__default["default"].createElement(shared.Slot, {
    name: "LeadingVisual"
  }, ({
    variant,
    disabled
  }) => /*#__PURE__*/React__default["default"].createElement(LeadingVisualContainer, _extends({
    sx: merge__default["default"]({
      color: shared.getVariantStyles(variant, disabled).iconColor,
      svg: {
        fontSize: 0
      }
    }, sx)
  }, props), props.children));
};
LeadingVisual.displayName = "LeadingVisual";
const TrailingVisual = ({
  sx = {},
  ...props
}) => {
  return /*#__PURE__*/React__default["default"].createElement(shared.Slot, {
    name: "TrailingVisual"
  }, ({
    variant,
    disabled
  }) => /*#__PURE__*/React__default["default"].createElement(Box, _extends({
    as: "span",
    sx: merge__default["default"]({
      height: '20px',
      // match height of text row
      flexShrink: 0,
      color: shared.getVariantStyles(variant, disabled).annotationColor,
      marginLeft: 2,
      fontWeight: 'initial'
    }, sx)
  }, props), props.children));
};
TrailingVisual.displayName = "TrailingVisual";

exports.LeadingVisual = LeadingVisual;
exports.LeadingVisualContainer = LeadingVisualContainer;
exports.TrailingVisual = TrailingVisual;
