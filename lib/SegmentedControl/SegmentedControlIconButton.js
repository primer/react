'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var sx = require('../sx.js');
var getSegmentedControlStyles = require('./getSegmentedControlStyles.js');
var Tooltip = require('../Tooltip.js');
var Box = require('../Box.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SegmentedControlIconButtonStyled = styled__default["default"].button.withConfig({
  displayName: "SegmentedControlIconButton__SegmentedControlIconButtonStyled",
  componentId: "sc-oxh6a9-0"
})(["", ";"], sx["default"]); // TODO: update this component to be accessible when we update the Tooltip component
// - we wouldn't render tooltip content inside a pseudoelement
// - users can pass custom tooltip text in addition to `ariaLabel`
//
// See Slack thread: https://github.slack.com/archives/C02NUUQ9C30/p1656444474509599
//

const SegmentedControlIconButton = ({
  'aria-label': ariaLabel,
  icon: Icon,
  selected,
  sx: sxProp = {},
  ...rest
}) => {
  const mergedSx = merge__default["default"]({
    width: '32px',
    // TODO: use primitive `control.medium.size` when it is available
    ...getSegmentedControlStyles.getSegmentedControlListItemStyles()
  }, sxProp);
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "li",
    sx: mergedSx
  }, /*#__PURE__*/React__default["default"].createElement(Tooltip, {
    text: ariaLabel
  }, /*#__PURE__*/React__default["default"].createElement(SegmentedControlIconButtonStyled, _extends({
    "aria-pressed": selected,
    sx: getSegmentedControlStyles.getSegmentedControlButtonStyles({
      selected,
      isIconOnly: true
    })
  }, rest), /*#__PURE__*/React__default["default"].createElement("span", {
    className: "segmentedControl-content"
  }, /*#__PURE__*/React__default["default"].createElement(Icon, null)))));
};
SegmentedControlIconButton.displayName = "SegmentedControlIconButton";
var SegmentedControlIconButton$1 = SegmentedControlIconButton;

exports.SegmentedControlIconButton = SegmentedControlIconButton;
exports["default"] = SegmentedControlIconButton$1;
