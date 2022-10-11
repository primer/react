'use strict';

var React = require('react');
var styled = require('styled-components');
var ButtonClose = require('./deprecated/Button/ButtonClose.js');
var constants = require('./constants.js');
var Box = require('./Box.js');
var useDialog = require('./hooks/useDialog.js');
var sx = require('./sx.js');
var Text = require('./Text.js');
var useRefObjectAsForwardedRef = require('./hooks/useRefObjectAsForwardedRef.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const noop = () => null;

const DialogBase = styled__default["default"].div.withConfig({
  displayName: "Dialog__DialogBase",
  componentId: "sc-13rdxb7-0"
})(["box-shadow:", ";border-radius:", ";position:fixed;top:0;left:50%;transform:translateX(-50%);max-height:80vh;z-index:999;margin:10vh auto;background-color:", ";width:", ";outline:none;@media screen and (max-width:750px){width:100vw;margin:0;border-radius:0;height:100vh;}", ";"], constants.get('shadows.shadow.large'), constants.get('radii.2'), constants.get('colors.canvas.default'), props => props.narrow ? '320px' : props.wide ? '640px' : '440px', sx["default"]);
const DialogHeaderBase = styled__default["default"](Box).withConfig({
  displayName: "Dialog__DialogHeaderBase",
  componentId: "sc-13rdxb7-1"
})(["border-radius:", " ", " 0px 0px;border-bottom:1px solid ", ";display:flex;@media screen and (max-width:750px){border-radius:0px;}", ";"], constants.get('radii.2'), constants.get('radii.2'), constants.get('colors.border.default'), sx["default"]);

function DialogHeader({
  theme,
  children,
  backgroundColor = 'gray.1',
  ...rest
}) {
  if (React__default["default"].Children.toArray(children).every(ch => typeof ch === 'string')) {
    children = /*#__PURE__*/React__default["default"].createElement(Text, {
      theme: theme,
      color: "fg.default",
      fontSize: 1,
      fontWeight: "bold",
      fontFamily: "sans-serif"
    }, children);
  }

  return /*#__PURE__*/React__default["default"].createElement(DialogHeaderBase, _extends({
    theme: theme,
    p: 3,
    backgroundColor: backgroundColor
  }, rest), children);
}

DialogHeader.displayName = "DialogHeader";
const Overlay = styled__default["default"].span.withConfig({
  displayName: "Dialog__Overlay",
  componentId: "sc-13rdxb7-2"
})(["&:before{position:fixed;top:0;right:0;bottom:0;left:0;display:block;cursor:default;content:' ';background:transparent;z-index:99;background:", ";}"], constants.get('colors.primer.canvas.backdrop'));
const Dialog = /*#__PURE__*/React.forwardRef(({
  children,
  onDismiss = noop,
  isOpen,
  initialFocusRef,
  returnFocusRef,
  ...props
}, forwardedRef) => {
  const overlayRef = React.useRef(null);
  const modalRef = React.useRef(null);
  useRefObjectAsForwardedRef.useRefObjectAsForwardedRef(forwardedRef, modalRef);
  const closeButtonRef = React.useRef(null);

  const onCloseClick = () => {
    onDismiss();

    if (returnFocusRef && returnFocusRef.current) {
      returnFocusRef.current.focus();
    }
  };

  const {
    getDialogProps
  } = useDialog({
    modalRef,
    onDismiss: onCloseClick,
    isOpen,
    initialFocusRef,
    closeButtonRef,
    returnFocusRef,
    overlayRef
  });
  return isOpen ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Overlay, {
    ref: overlayRef
  }), /*#__PURE__*/React__default["default"].createElement(DialogBase, _extends({
    tabIndex: -1,
    ref: modalRef,
    role: "dialog",
    "aria-modal": "true"
  }, props, getDialogProps()), /*#__PURE__*/React__default["default"].createElement(ButtonClose, {
    ref: closeButtonRef,
    onClick: onCloseClick,
    sx: {
      position: 'absolute',
      top: '16px',
      right: '16px'
    }
  }), children)) : null;
});
DialogHeader.defaultProps = {
  backgroundColor: 'canvas.subtle'
};
DialogHeader.propTypes = { ...Box.propTypes
};
DialogHeader.displayName = 'Dialog.Header';
Dialog.displayName = 'Dialog';
var Dialog$1 = Object.assign(Dialog, {
  Header: DialogHeader
});

module.exports = Dialog$1;
