import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { TYPOGRAPHY, COMMON } from './constants.js';
import { useTheme } from './ThemeProvider.js';
import 'focus-visible';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GlobalStyle = createGlobalStyle(["*{box-sizing:border-box;}body{margin:0;}table{border-collapse:collapse;}input{color-scheme:", ";}[role=\"button\"]:focus:not(:focus-visible):not(.focus-visible),[role=\"tabpanel\"][tabindex=\"0\"]:focus:not(:focus-visible):not(.focus-visible),button:focus:not(:focus-visible):not(.focus-visible),summary:focus:not(:focus-visible):not(.focus-visible),a:focus:not(:focus-visible):not(.focus-visible){outline:none;box-shadow:none;}[tabindex=\"0\"]:focus:not(:focus-visible):not(.focus-visible),details-dialog:focus:not(:focus-visible):not(.focus-visible){outline:none;}"], props => props.colorScheme);
const Base = styled.div.withConfig({
  displayName: "BaseStyles__Base",
  componentId: "sc-nfjs56-0"
})(["", ";", ";"], TYPOGRAPHY, COMMON);

function BaseStyles(props) {
  const {
    children,
    ...rest
  } = props;
  const {
    colorScheme
  } = useTheme();
  return /*#__PURE__*/React.createElement(Base, _extends({}, rest, {
    "data-portal-root": true
  }), /*#__PURE__*/React.createElement(GlobalStyle, {
    colorScheme: colorScheme !== null && colorScheme !== void 0 && colorScheme.includes('dark') ? 'dark' : 'light'
  }), children);
}

BaseStyles.displayName = "BaseStyles";
BaseStyles.defaultProps = {
  color: 'fg.default',
  fontFamily: 'normal',
  lineHeight: 'default'
};

export { BaseStyles as default };
