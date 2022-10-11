'use strict';

var React = require('react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const animateModal = styled.keyframes(["0%{opacity:0;transform:scale(0.9);}"]);
const modalStyles = styled.css(["position:relative;z-index:99;display:flex;", ";max-height:", ";margin:auto 0;", ";overflow:hidden;pointer-events:auto;flex-direction:column;background-color:", ";border-radius:", ";box-shadow:", ";animation:", " 0.12s cubic-bezier(0,0.1,0.1,1) backwards;@media (min-width:", "){height:auto;max-height:350px;margin:", " 0 ", " 0;font-size:", ";border:", " solid ", ";border-radius:", ";box-shadow:", ";}"], props => props.filter ? 'height: 80%' : '', props => props.filter ? 'none' : '66%', props => props.filter ? 'margin-top: 0' : '', constants.get('colors.canvas.overlay'), constants.get('radii.2'), constants.get('shadows.shadow.small'), animateModal, constants.get('breakpoints.0'), constants.get('space.1'), constants.get('space.3'), constants.get('fontSizes.0'), constants.get('borderWidths.1'), constants.get('colors.border.default'), constants.get('radii.2'), constants.get('shadows.shadow.small'));
const modalWrapperStyles = styled.css(["position:fixed;top:0;right:0;bottom:0;left:0;z-index:99;display:flex;padding:", ";pointer-events:none;flex-direction:column;&::before{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none;content:'';background-color:", ";@media (min-width:", "){display:none;}}@media (min-width:", "){position:absolute;top:auto;right:", ";bottom:auto;left:auto;padding:0;}"], constants.get('space.3'), constants.get('colors.primer.canvas.backdrop'), constants.get('breakpoints.0'), constants.get('breakpoints.0'), props => props.align === 'right' ? '0' : 'auto');
const Modal = styled__default["default"].div.withConfig({
  displayName: "SelectMenuModal__Modal",
  componentId: "sc-miglbs-0"
})(["", " ", ""], modalStyles, styledSystem.width);
const ModalWrapper = styled__default["default"].div.withConfig({
  displayName: "SelectMenuModal__ModalWrapper",
  componentId: "sc-miglbs-1"
})(["", " ", ";"], modalWrapperStyles, sx["default"]);
const SelectMenuModal = /*#__PURE__*/React__default["default"].forwardRef(({
  children,
  theme,
  width: widthProp,
  ...rest
}, forwardedRef) => {
  return /*#__PURE__*/React__default["default"].createElement(ModalWrapper, _extends({
    theme: theme
  }, rest, {
    role: "menu",
    ref: forwardedRef
  }), /*#__PURE__*/React__default["default"].createElement(Modal, {
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

module.exports = SelectMenuModal$1;
