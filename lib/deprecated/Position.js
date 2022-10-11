'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var Box = require('../Box.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @deprecated Use the Box component instead (i.e. <Position> → <Box>)
 */
const Position = styled__default["default"](Box).withConfig({
  displayName: "Position",
  componentId: "sc-1qlzjcz-0"
})([""]);

/**
 * @deprecated Use the Box component instead (i.e. <Absolute> → <Box position="absolute">)
 */
var Position$1 = Position; // Absolute

/**
 * @deprecated Use the Box component instead (i.e. <Absolute> → <Box position="absolute">)
 */
const Absolute = /*#__PURE__*/React__default["default"].forwardRef((props, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(Position, _extends({}, props, {
    position: "absolute",
    ref: ref
  }));
});
Absolute.displayName = 'Absolute'; // Fixed

/**
 * @deprecated Use the Box component instead (i.e. <Fixed> → <Box position="fixed">)
 */
const Fixed = /*#__PURE__*/React__default["default"].forwardRef((props, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(Position, _extends({}, props, {
    position: "fixed",
    ref: ref
  }));
});
Fixed.displayName = 'Fixed'; // Relative

/**
 * @deprecated Use the Box component instead (i.e. <Relative> → <Box position="relative">)
 */
const Relative = /*#__PURE__*/React__default["default"].forwardRef((props, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(Position, _extends({}, props, {
    position: "relative",
    ref: ref
  }));
});
Relative.displayName = 'Relative'; // Sticky

/**
 * @deprecated Use the Box component instead (i.e. <Sticky> → <Box position="sticky">)
 */
const Sticky = /*#__PURE__*/React__default["default"].forwardRef((props, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(Position, _extends({}, props, {
    position: "sticky",
    ref: ref
  }));
});
Sticky.defaultProps = {
  top: 0,
  zIndex: 1
};
Sticky.displayName = 'Sticky';

exports.Absolute = Absolute;
exports.Fixed = Fixed;
exports.Relative = Relative;
exports.Sticky = Sticky;
exports["default"] = Position$1;
