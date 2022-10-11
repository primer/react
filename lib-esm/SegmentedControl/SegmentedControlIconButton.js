import React from 'react';
import styled from 'styled-components';
import sx from '../sx.js';
import { getSegmentedControlListItemStyles, getSegmentedControlButtonStyles } from './getSegmentedControlStyles.js';
import Tooltip from '../Tooltip.js';
import Box from '../Box.js';
import merge from 'deepmerge';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SegmentedControlIconButtonStyled = styled.button.withConfig({
  displayName: "SegmentedControlIconButton__SegmentedControlIconButtonStyled",
  componentId: "sc-oxh6a9-0"
})(["", ";"], sx); // TODO: update this component to be accessible when we update the Tooltip component
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
  const mergedSx = merge({
    width: '32px',
    // TODO: use primitive `control.medium.size` when it is available
    ...getSegmentedControlListItemStyles()
  }, sxProp);
  return /*#__PURE__*/React.createElement(Box, {
    as: "li",
    sx: mergedSx
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: ariaLabel
  }, /*#__PURE__*/React.createElement(SegmentedControlIconButtonStyled, _extends({
    "aria-pressed": selected,
    sx: getSegmentedControlButtonStyles({
      selected,
      isIconOnly: true
    })
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "segmentedControl-content"
  }, /*#__PURE__*/React.createElement(Icon, null)))));
};
SegmentedControlIconButton.displayName = "SegmentedControlIconButton";
var SegmentedControlIconButton$1 = SegmentedControlIconButton;

export { SegmentedControlIconButton, SegmentedControlIconButton$1 as default };
