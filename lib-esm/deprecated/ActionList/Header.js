import React from 'react';
import styled, { css } from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * Contract for props passed to the `Header` component.
 */

const StyledHeader = styled.div.withConfig({
  displayName: "Header__StyledHeader",
  componentId: "sc-cjezay-0"
})(["{}padding:6px ", ";font-size:", ";font-weight:", ";color:", ";", " ", ""], get('space.3'), get('fontSizes.0'), get('fontWeights.bold'), get('colors.fg.muted'), ({
  variant
}) => variant === 'filled' && css(["background:", ";margin:", " 0;border-top:1px solid ", ";border-bottom:1px solid ", ";&:first-child{margin-top:0;}"], get('colors.canvas.subtle'), get('space.2'), get('colors.neutral.muted'), get('colors.neutral.muted')), sx);
/**
 * Displays the name and description of a `Group`.
 */

function Header({
  variant = 'subtle',
  title,
  auxiliaryText,
  children: _children,
  ...props
}) {
  return /*#__PURE__*/React.createElement(StyledHeader, _extends({
    role: "heading",
    variant: variant
  }, props), title, auxiliaryText && /*#__PURE__*/React.createElement("span", null, auxiliaryText));
}
Header.displayName = "Header";

export { Header, StyledHeader };
