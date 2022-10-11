import React from 'react';
import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// SelectMenu.Header is intentionally not exported, it's an internal component used in
// SelectMenu.Modal
const SelectMenuTitle = styled.h3.withConfig({
  displayName: "SelectMenuHeader__SelectMenuTitle",
  componentId: "sc-168btih-0"
})(["color:", ";flex:auto;font-size:", ";font-weight:", ";margin:0;@media (min-width:", "){font-size:inherit;}"], get('colors.fg.default'), get('fontSizes.1'), get('fontWeights.bold'), get('breakpoints.0'));
const StyledHeader = styled.header.withConfig({
  displayName: "SelectMenuHeader__StyledHeader",
  componentId: "sc-168btih-1"
})(["display:flex;flex:none;padding:", ";border-bottom:", " solid ", ";@media (min-width:", "){padding-top:", ";padding-bottom:", ";}", ";"], get('space.3'), get('borderWidths'), get('colors.border.muted'), get('breakpoints.0'), get('space.2'), get('space.2'), sx);

const SelectMenuHeader = ({
  children,
  theme,
  ...rest
}) => {
  return /*#__PURE__*/React.createElement(StyledHeader, _extends({
    theme: theme
  }, rest), /*#__PURE__*/React.createElement(SelectMenuTitle, {
    theme: theme
  }, children));
};

SelectMenuHeader.displayName = "SelectMenuHeader";
SelectMenuHeader.displayName = 'SelectMenu.Header';
var SelectMenuHeader$1 = SelectMenuHeader;

export { SelectMenuHeader$1 as default };
