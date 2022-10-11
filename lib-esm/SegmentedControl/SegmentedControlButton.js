import React from 'react';
import styled from 'styled-components';
import Box from '../Box.js';
import sx from '../sx.js';
import { getSegmentedControlListItemStyles, getSegmentedControlButtonStyles } from './getSegmentedControlStyles.js';
import merge from 'deepmerge';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SegmentedControlButtonStyled = styled.button.withConfig({
  displayName: "SegmentedControlButton__SegmentedControlButtonStyled",
  componentId: "sc-8lkgxl-0"
})(["", ";"], sx);

const SegmentedControlButton = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp = {},
  ...rest
}) => {
  const mergedSx = merge(getSegmentedControlListItemStyles(), sxProp);
  return /*#__PURE__*/React.createElement(Box, {
    as: "li",
    sx: mergedSx
  }, /*#__PURE__*/React.createElement(SegmentedControlButtonStyled, _extends({
    "aria-current": selected,
    sx: getSegmentedControlButtonStyles({
      selected,
      children
    })
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "segmentedControl-content"
  }, LeadingIcon && /*#__PURE__*/React.createElement(Box, {
    mr: 1
  }, /*#__PURE__*/React.createElement(LeadingIcon, null)), /*#__PURE__*/React.createElement(Box, {
    className: "segmentedControl-text"
  }, children))));
};

SegmentedControlButton.displayName = "SegmentedControlButton";
var Button = SegmentedControlButton;

export { Button as default };
