'use strict';

var React = require('react');
var styled = require('styled-components');
var Box = require('../Box.js');
var sx = require('../sx.js');
var getSegmentedControlStyles = require('./getSegmentedControlStyles.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SegmentedControlButtonStyled = styled__default["default"].button.withConfig({
  displayName: "SegmentedControlButton__SegmentedControlButtonStyled",
  componentId: "sc-8lkgxl-0"
})(["", ";"], sx["default"]);

const SegmentedControlButton = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp = {},
  ...rest
}) => {
  const mergedSx = merge__default["default"](getSegmentedControlStyles.getSegmentedControlListItemStyles(), sxProp);
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "li",
    sx: mergedSx
  }, /*#__PURE__*/React__default["default"].createElement(SegmentedControlButtonStyled, _extends({
    "aria-current": selected,
    sx: getSegmentedControlStyles.getSegmentedControlButtonStyles({
      selected,
      children
    })
  }, rest), /*#__PURE__*/React__default["default"].createElement("span", {
    className: "segmentedControl-content"
  }, LeadingIcon && /*#__PURE__*/React__default["default"].createElement(Box, {
    mr: 1
  }, /*#__PURE__*/React__default["default"].createElement(LeadingIcon, null)), /*#__PURE__*/React__default["default"].createElement(Box, {
    className: "segmentedControl-text"
  }, children))));
};

SegmentedControlButton.displayName = "SegmentedControlButton";
var Button = SegmentedControlButton;

module.exports = Button;
