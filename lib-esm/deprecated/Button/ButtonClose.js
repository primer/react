import { XIcon } from '@primer/octicons-react';
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledButton = styled.button.withConfig({
  displayName: "ButtonClose__StyledButton",
  componentId: "sc-azdk6r-0"
})(["border:none;padding:0;background:transparent;outline:none;cursor:pointer;border-radius:", ";color:", ";&:focus{box-shadow:", ";}&:hover{color:", ";}", ";"], get('radii.2'), get('colors.fg.muted'), get('shadows.btn.focusShadow'), get('colors.accent.fg'), sx);
const ButtonClose = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(StyledButton, _extends({
    ref: ref,
    "aria-label": "Close"
  }, props), /*#__PURE__*/React.createElement(XIcon, null));
});
var ButtonClose$1 = ButtonClose;

export { ButtonClose$1 as default };
