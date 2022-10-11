import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { width } from 'styled-system';
import { get } from '../../constants.js';
import sx from '../../sx.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const animateModal = keyframes(["0%{opacity:0;transform:scale(0.9);}"]);
const modalStyles = css(["position:relative;z-index:99;display:flex;", ";max-height:", ";margin:auto 0;", ";overflow:hidden;pointer-events:auto;flex-direction:column;background-color:", ";border-radius:", ";box-shadow:", ";animation:", " 0.12s cubic-bezier(0,0.1,0.1,1) backwards;@media (min-width:", "){height:auto;max-height:350px;margin:", " 0 ", " 0;font-size:", ";border:", " solid ", ";border-radius:", ";box-shadow:", ";}"], props => props.filter ? 'height: 80%' : '', props => props.filter ? 'none' : '66%', props => props.filter ? 'margin-top: 0' : '', get('colors.canvas.overlay'), get('radii.2'), get('shadows.shadow.small'), animateModal, get('breakpoints.0'), get('space.1'), get('space.3'), get('fontSizes.0'), get('borderWidths.1'), get('colors.border.default'), get('radii.2'), get('shadows.shadow.small'));
const modalWrapperStyles = css(["position:fixed;top:0;right:0;bottom:0;left:0;z-index:99;display:flex;padding:", ";pointer-events:none;flex-direction:column;&::before{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none;content:'';background-color:", ";@media (min-width:", "){display:none;}}@media (min-width:", "){position:absolute;top:auto;right:", ";bottom:auto;left:auto;padding:0;}"], get('space.3'), get('colors.primer.canvas.backdrop'), get('breakpoints.0'), get('breakpoints.0'), props => props.align === 'right' ? '0' : 'auto');
const Modal = styled.div.withConfig({
  displayName: "SelectMenuModal__Modal",
  componentId: "sc-miglbs-0"
})(["", " ", ""], modalStyles, width);
const ModalWrapper = styled.div.withConfig({
  displayName: "SelectMenuModal__ModalWrapper",
  componentId: "sc-miglbs-1"
})(["", " ", ";"], modalWrapperStyles, sx);
const SelectMenuModal = /*#__PURE__*/React.forwardRef(({
  children,
  theme,
  width: widthProp,
  ...rest
}, forwardedRef) => {
  return /*#__PURE__*/React.createElement(ModalWrapper, _extends({
    theme: theme
  }, rest, {
    role: "menu",
    ref: forwardedRef
  }), /*#__PURE__*/React.createElement(Modal, {
    theme: theme,
    width: widthProp
  }, children));
});
SelectMenuModal.defaultProps = {
  align: 'left',
  width: '300px'
};
SelectMenuModal.displayName = 'SelectMenu.Modal';
var SelectMenuModal$1 = SelectMenuModal;

export { SelectMenuModal$1 as default };
