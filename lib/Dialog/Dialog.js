'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var Box = require('../Box.js');
var constants = require('../constants.js');
var useFocusTrap = require('../hooks/useFocusTrap.js');
var sx = require('../sx.js');
var StyledOcticon = require('../StyledOcticon.js');
var octiconsReact = require('@primer/octicons-react');
var useFocusZone = require('../hooks/useFocusZone.js');
var behaviors = require('@primer/behaviors');
var index = require('../Portal/index.js');
var useRefObjectAsForwardedRef = require('../hooks/useRefObjectAsForwardedRef.js');
var ssr = require('@react-aria/ssr');
var Button = require('../deprecated/Button/Button.js');
var useOnEscapePress = require('../hooks/useOnEscapePress.js');
var useProvidedRefOrCreate = require('../hooks/useProvidedRefOrCreate.js');
var ButtonPrimary = require('../deprecated/Button/ButtonPrimary.js');
var ButtonDanger = require('../deprecated/Button/ButtonDanger.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ANIMATION_DURATION = '200ms';
/**
 * Props that characterize a button to be rendered into the footer of
 * a Dialog.
 */

const Backdrop = styled__default["default"]('div').withConfig({
  displayName: "Dialog__Backdrop",
  componentId: "sc-uaxjsn-0"
})(["position:fixed;top:0;left:0;bottom:0;right:0;display:flex;align-items:center;justify-content:center;background-color:rgba(0,0,0,0.4);animation:dialog-backdrop-appear ", " ", ";@keyframes dialog-backdrop-appear{0%{opacity:0;}100%{opacity:1;}}"], ANIMATION_DURATION, constants.get('animation.easeOutCubic'));
const heightMap = {
  small: '480px',
  large: '640px',
  auto: 'auto'
};
const widthMap = {
  small: '296px',
  medium: '320px',
  large: '480px',
  xlarge: '640px'
};
const StyledDialog = styled__default["default"].div.withConfig({
  displayName: "Dialog__StyledDialog",
  componentId: "sc-uaxjsn-1"
})(["display:flex;flex-direction:column;background-color:", ";box-shadow:", ";min-width:296px;max-width:calc(100vw - 64px);max-height:calc(100vh - 64px);width:", ";height:", ";border-radius:12px;opacity:1;animation:overlay--dialog-appear ", " ", ";@keyframes overlay--dialog-appear{0%{opacity:0;transform:scale(0.5);}100%{opacity:1;transform:scale(1);}}", ";"], constants.get('colors.canvas.overlay'), constants.get('shadows.overlay.shadow'), props => {
  var _props$width;

  return widthMap[(_props$width = props.width) !== null && _props$width !== void 0 ? _props$width : 'xlarge'];
}, props => {
  var _props$height;

  return heightMap[(_props$height = props.height) !== null && _props$height !== void 0 ? _props$height : 'auto'];
}, ANIMATION_DURATION, constants.get('animation.easeOutCubic'), sx["default"]);

const DefaultHeader = ({
  dialogLabelId,
  title,
  subtitle,
  dialogDescriptionId,
  onClose
}) => {
  const onCloseClick = React.useCallback(() => {
    onClose('close-button');
  }, [onClose]);
  return /*#__PURE__*/React__default["default"].createElement(Dialog.Header, null, /*#__PURE__*/React__default["default"].createElement(Box, {
    display: "flex"
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
    display: "flex",
    px: 2,
    py: "6px",
    flexDirection: "column",
    flexGrow: 1
  }, /*#__PURE__*/React__default["default"].createElement(Dialog.Title, {
    id: dialogLabelId
  }, title !== null && title !== void 0 ? title : 'Dialog'), subtitle && /*#__PURE__*/React__default["default"].createElement(Dialog.Subtitle, {
    id: dialogDescriptionId
  }, subtitle)), /*#__PURE__*/React__default["default"].createElement(Dialog.CloseButton, {
    onClose: onCloseClick
  })));
};

DefaultHeader.displayName = "DefaultHeader";

const DefaultBody = ({
  children
}) => {
  return /*#__PURE__*/React__default["default"].createElement(Dialog.Body, null, children);
};

DefaultBody.displayName = "DefaultBody";

const DefaultFooter = ({
  footerButtons
}) => {
  const {
    containerRef: footerRef
  } = useFocusZone.useFocusZone({
    bindKeys: behaviors.FocusKeys.ArrowHorizontal | behaviors.FocusKeys.Tab,
    focusInStrategy: 'closest'
  });
  return footerButtons ? /*#__PURE__*/React__default["default"].createElement(Dialog.Footer, {
    ref: footerRef
  }, /*#__PURE__*/React__default["default"].createElement(Dialog.Buttons, {
    buttons: footerButtons
  })) : null;
};

const _Dialog = /*#__PURE__*/React__default["default"].forwardRef((props, forwardedRef) => {
  const {
    title = 'Dialog',
    subtitle = '',
    renderHeader,
    renderBody,
    renderFooter,
    onClose,
    role = 'dialog',
    width = 'xlarge',
    height = 'auto',
    footerButtons = []
  } = props;
  const dialogLabelId = ssr.useSSRSafeId();
  const dialogDescriptionId = ssr.useSSRSafeId();
  const autoFocusedFooterButtonRef = React.useRef(null);

  for (const footerButton of footerButtons) {
    if (footerButton.autoFocus) {
      footerButton.ref = autoFocusedFooterButtonRef;
    }
  }

  const defaultedProps = { ...props,
    title,
    subtitle,
    role,
    dialogLabelId,
    dialogDescriptionId
  };
  const dialogRef = React.useRef(null);
  useRefObjectAsForwardedRef.useRefObjectAsForwardedRef(forwardedRef, dialogRef);
  const backdropRef = React.useRef(null);
  useFocusTrap.useFocusTrap({
    containerRef: dialogRef,
    restoreFocusOnCleanUp: true,
    initialFocusRef: autoFocusedFooterButtonRef
  });
  useOnEscapePress.useOnEscapePress(event => {
    onClose('escape');
    event.preventDefault();
  }, [onClose]);
  const header = (renderHeader !== null && renderHeader !== void 0 ? renderHeader : DefaultHeader)(defaultedProps);
  const body = (renderBody !== null && renderBody !== void 0 ? renderBody : DefaultBody)(defaultedProps);
  const footer = (renderFooter !== null && renderFooter !== void 0 ? renderFooter : DefaultFooter)(defaultedProps);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(index["default"], null, /*#__PURE__*/React__default["default"].createElement(Backdrop, {
    ref: backdropRef
  }, /*#__PURE__*/React__default["default"].createElement(StyledDialog, {
    width: width,
    height: height,
    ref: dialogRef,
    role: role,
    "aria-labelledby": dialogLabelId,
    "aria-describedby": dialogDescriptionId
  }, header, body, footer))));
});

_Dialog.displayName = 'Dialog';
const Header = styled__default["default"].div.attrs({
  as: 'header'
}).withConfig({
  displayName: "Dialog__Header",
  componentId: "sc-uaxjsn-2"
})(["box-shadow:0 1px 0 ", ";padding:", ";z-index:1;flex-shrink:0;"], constants.get('colors.border.default'), constants.get('space.2'));
const Title = styled__default["default"].h1.withConfig({
  displayName: "Dialog__Title",
  componentId: "sc-uaxjsn-3"
})(["font-size:", ";font-weight:", ";margin:0;", ";"], constants.get('fontSizes.1'), constants.get('fontWeights.bold'), sx["default"]);
const Subtitle = styled__default["default"].h2.withConfig({
  displayName: "Dialog__Subtitle",
  componentId: "sc-uaxjsn-4"
})(["font-size:", ";color:", ";margin:0;margin-top:", ";", ";"], constants.get('fontSizes.0'), constants.get('colors.fg.muted'), constants.get('space.1'), sx["default"]);
const Body = styled__default["default"].div.withConfig({
  displayName: "Dialog__Body",
  componentId: "sc-uaxjsn-5"
})(["flex-grow:1;overflow:auto;padding:", ";", ";"], constants.get('space.3'), sx["default"]);
const Footer = styled__default["default"].div.attrs({
  as: 'footer'
}).withConfig({
  displayName: "Dialog__Footer",
  componentId: "sc-uaxjsn-6"
})(["box-shadow:0 -1px 0 ", ";padding:", ";display:flex;flex-flow:wrap;justify-content:flex-end;z-index:1;flex-shrink:0;button{margin-left:", ";&:first-child{margin-left:0;}}", ";"], constants.get('colors.border.default'), constants.get('space.3'), constants.get('space.1'), sx["default"]);
const buttonTypes = {
  normal: Button,
  primary: ButtonPrimary["default"],
  danger: ButtonDanger
};

const Buttons = ({
  buttons
}) => {
  var _buttons$find;

  const autoFocusRef = useProvidedRefOrCreate.useProvidedRefOrCreate((_buttons$find = buttons.find(button => button.autoFocus)) === null || _buttons$find === void 0 ? void 0 : _buttons$find.ref);
  let autoFocusCount = 0;
  const [hasRendered, setHasRendered] = React.useState(0);
  React.useEffect(() => {
    // hack to work around dialogs originating from other focus traps.
    if (hasRendered === 1) {
      var _autoFocusRef$current;

      (_autoFocusRef$current = autoFocusRef.current) === null || _autoFocusRef$current === void 0 ? void 0 : _autoFocusRef$current.focus();
    } else {
      setHasRendered(hasRendered + 1);
    }
  }, [autoFocusRef, hasRendered]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, buttons.map((dialogButtonProps, index) => {
    const {
      content,
      buttonType = 'normal',
      autoFocus = false,
      ...buttonProps
    } = dialogButtonProps;
    const ButtonElement = buttonTypes[buttonType];
    return /*#__PURE__*/React__default["default"].createElement(ButtonElement, _extends({
      key: index
    }, buttonProps, {
      variant: buttonType,
      ref: autoFocus && autoFocusCount === 0 ? (autoFocusCount++, autoFocusRef) : null
    }), content);
  }));
};

const DialogCloseButton = styled__default["default"](Button).withConfig({
  displayName: "Dialog__DialogCloseButton",
  componentId: "sc-uaxjsn-7"
})(["border-radius:4px;background:transparent;border:0;vertical-align:middle;color:", ";padding:", ";align-self:flex-start;line-height:normal;box-shadow:none;"], constants.get('colors.fg.muted'), constants.get('space.2'));

const CloseButton = ({
  onClose
}) => {
  return /*#__PURE__*/React__default["default"].createElement(DialogCloseButton, {
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React__default["default"].createElement(StyledOcticon, {
    icon: octiconsReact.XIcon
  }));
};

CloseButton.displayName = "CloseButton";

/**
 * A dialog is a type of overlay that can be used for confirming actions, asking
 * for disambiguation, and presenting small forms. They generally allow the user
 * to focus on a quick task without having to navigate to a different page.
 *
 * Dialogs appear in the page after a direct user interaction. Don't show dialogs
 * on page load or as system alerts.
 *
 * Dialogs appear centered in the page, with a visible backdrop that dims the rest
 * of the window for focus.
 *
 * All dialogs have a title and a close button.
 *
 * Dialogs are modal. Dialogs can be dismissed by clicking on the close button,
 * pressing the escape key, or by interacting with another button in the dialog.
 * To avoid losing information and missing important messages, clicking outside
 * of the dialog will not close it.
 *
 * The sub components provided (e.g. Header, Title, etc.) are available for custom
 * renderers only. They are not intended to be used otherwise.
 */
const Dialog = Object.assign(_Dialog, {
  Header,
  Title,
  Subtitle,
  Body,
  Footer,
  Buttons,
  CloseButton
});

exports.Dialog = Dialog;
