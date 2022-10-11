import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Box from '../Box.js';
import { get } from '../constants.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import sx from '../sx.js';
import StyledOcticon from '../StyledOcticon.js';
import { XIcon } from '@primer/octicons-react';
import { useFocusZone } from '../hooks/useFocusZone.js';
import { FocusKeys } from '@primer/behaviors';
import Portal from '../Portal/index.js';
import { useRefObjectAsForwardedRef } from '../hooks/useRefObjectAsForwardedRef.js';
import { useSSRSafeId } from '@react-aria/ssr';
import Button from '../deprecated/Button/Button.js';
import { useOnEscapePress } from '../hooks/useOnEscapePress.js';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import ButtonPrimary from '../deprecated/Button/ButtonPrimary.js';
import ButtonDanger from '../deprecated/Button/ButtonDanger.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ANIMATION_DURATION = '200ms';
/**
 * Props that characterize a button to be rendered into the footer of
 * a Dialog.
 */

const Backdrop = styled('div').withConfig({
  displayName: "Dialog__Backdrop",
  componentId: "sc-uaxjsn-0"
})(["position:fixed;top:0;left:0;bottom:0;right:0;display:flex;align-items:center;justify-content:center;background-color:rgba(0,0,0,0.4);animation:dialog-backdrop-appear ", " ", ";@keyframes dialog-backdrop-appear{0%{opacity:0;}100%{opacity:1;}}"], ANIMATION_DURATION, get('animation.easeOutCubic'));
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
const StyledDialog = styled.div.withConfig({
  displayName: "Dialog__StyledDialog",
  componentId: "sc-uaxjsn-1"
})(["display:flex;flex-direction:column;background-color:", ";box-shadow:", ";min-width:296px;max-width:calc(100vw - 64px);max-height:calc(100vh - 64px);width:", ";height:", ";border-radius:12px;opacity:1;animation:overlay--dialog-appear ", " ", ";@keyframes overlay--dialog-appear{0%{opacity:0;transform:scale(0.5);}100%{opacity:1;transform:scale(1);}}", ";"], get('colors.canvas.overlay'), get('shadows.overlay.shadow'), props => {
  var _props$width;

  return widthMap[(_props$width = props.width) !== null && _props$width !== void 0 ? _props$width : 'xlarge'];
}, props => {
  var _props$height;

  return heightMap[(_props$height = props.height) !== null && _props$height !== void 0 ? _props$height : 'auto'];
}, ANIMATION_DURATION, get('animation.easeOutCubic'), sx);

const DefaultHeader = ({
  dialogLabelId,
  title,
  subtitle,
  dialogDescriptionId,
  onClose
}) => {
  const onCloseClick = useCallback(() => {
    onClose('close-button');
  }, [onClose]);
  return /*#__PURE__*/React.createElement(Dialog.Header, null, /*#__PURE__*/React.createElement(Box, {
    display: "flex"
  }, /*#__PURE__*/React.createElement(Box, {
    display: "flex",
    px: 2,
    py: "6px",
    flexDirection: "column",
    flexGrow: 1
  }, /*#__PURE__*/React.createElement(Dialog.Title, {
    id: dialogLabelId
  }, title !== null && title !== void 0 ? title : 'Dialog'), subtitle && /*#__PURE__*/React.createElement(Dialog.Subtitle, {
    id: dialogDescriptionId
  }, subtitle)), /*#__PURE__*/React.createElement(Dialog.CloseButton, {
    onClose: onCloseClick
  })));
};

DefaultHeader.displayName = "DefaultHeader";

const DefaultBody = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(Dialog.Body, null, children);
};

DefaultBody.displayName = "DefaultBody";

const DefaultFooter = ({
  footerButtons
}) => {
  const {
    containerRef: footerRef
  } = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest'
  });
  return footerButtons ? /*#__PURE__*/React.createElement(Dialog.Footer, {
    ref: footerRef
  }, /*#__PURE__*/React.createElement(Dialog.Buttons, {
    buttons: footerButtons
  })) : null;
};

const _Dialog = /*#__PURE__*/React.forwardRef((props, forwardedRef) => {
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
  const dialogLabelId = useSSRSafeId();
  const dialogDescriptionId = useSSRSafeId();
  const autoFocusedFooterButtonRef = useRef(null);

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
  const dialogRef = useRef(null);
  useRefObjectAsForwardedRef(forwardedRef, dialogRef);
  const backdropRef = useRef(null);
  useFocusTrap({
    containerRef: dialogRef,
    restoreFocusOnCleanUp: true,
    initialFocusRef: autoFocusedFooterButtonRef
  });
  useOnEscapePress(event => {
    onClose('escape');
    event.preventDefault();
  }, [onClose]);
  const header = (renderHeader !== null && renderHeader !== void 0 ? renderHeader : DefaultHeader)(defaultedProps);
  const body = (renderBody !== null && renderBody !== void 0 ? renderBody : DefaultBody)(defaultedProps);
  const footer = (renderFooter !== null && renderFooter !== void 0 ? renderFooter : DefaultFooter)(defaultedProps);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Portal, null, /*#__PURE__*/React.createElement(Backdrop, {
    ref: backdropRef
  }, /*#__PURE__*/React.createElement(StyledDialog, {
    width: width,
    height: height,
    ref: dialogRef,
    role: role,
    "aria-labelledby": dialogLabelId,
    "aria-describedby": dialogDescriptionId
  }, header, body, footer))));
});

_Dialog.displayName = 'Dialog';
const Header = styled.div.attrs({
  as: 'header'
}).withConfig({
  displayName: "Dialog__Header",
  componentId: "sc-uaxjsn-2"
})(["box-shadow:0 1px 0 ", ";padding:", ";z-index:1;flex-shrink:0;"], get('colors.border.default'), get('space.2'));
const Title = styled.h1.withConfig({
  displayName: "Dialog__Title",
  componentId: "sc-uaxjsn-3"
})(["font-size:", ";font-weight:", ";margin:0;", ";"], get('fontSizes.1'), get('fontWeights.bold'), sx);
const Subtitle = styled.h2.withConfig({
  displayName: "Dialog__Subtitle",
  componentId: "sc-uaxjsn-4"
})(["font-size:", ";color:", ";margin:0;margin-top:", ";", ";"], get('fontSizes.0'), get('colors.fg.muted'), get('space.1'), sx);
const Body = styled.div.withConfig({
  displayName: "Dialog__Body",
  componentId: "sc-uaxjsn-5"
})(["flex-grow:1;overflow:auto;padding:", ";", ";"], get('space.3'), sx);
const Footer = styled.div.attrs({
  as: 'footer'
}).withConfig({
  displayName: "Dialog__Footer",
  componentId: "sc-uaxjsn-6"
})(["box-shadow:0 -1px 0 ", ";padding:", ";display:flex;flex-flow:wrap;justify-content:flex-end;z-index:1;flex-shrink:0;button{margin-left:", ";&:first-child{margin-left:0;}}", ";"], get('colors.border.default'), get('space.3'), get('space.1'), sx);
const buttonTypes = {
  normal: Button,
  primary: ButtonPrimary,
  danger: ButtonDanger
};

const Buttons = ({
  buttons
}) => {
  var _buttons$find;

  const autoFocusRef = useProvidedRefOrCreate((_buttons$find = buttons.find(button => button.autoFocus)) === null || _buttons$find === void 0 ? void 0 : _buttons$find.ref);
  let autoFocusCount = 0;
  const [hasRendered, setHasRendered] = useState(0);
  useEffect(() => {
    // hack to work around dialogs originating from other focus traps.
    if (hasRendered === 1) {
      var _autoFocusRef$current;

      (_autoFocusRef$current = autoFocusRef.current) === null || _autoFocusRef$current === void 0 ? void 0 : _autoFocusRef$current.focus();
    } else {
      setHasRendered(hasRendered + 1);
    }
  }, [autoFocusRef, hasRendered]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, buttons.map((dialogButtonProps, index) => {
    const {
      content,
      buttonType = 'normal',
      autoFocus = false,
      ...buttonProps
    } = dialogButtonProps;
    const ButtonElement = buttonTypes[buttonType];
    return /*#__PURE__*/React.createElement(ButtonElement, _extends({
      key: index
    }, buttonProps, {
      variant: buttonType,
      ref: autoFocus && autoFocusCount === 0 ? (autoFocusCount++, autoFocusRef) : null
    }), content);
  }));
};

const DialogCloseButton = styled(Button).withConfig({
  displayName: "Dialog__DialogCloseButton",
  componentId: "sc-uaxjsn-7"
})(["border-radius:4px;background:transparent;border:0;vertical-align:middle;color:", ";padding:", ";align-self:flex-start;line-height:normal;box-shadow:none;"], get('colors.fg.muted'), get('space.2'));

const CloseButton = ({
  onClose
}) => {
  return /*#__PURE__*/React.createElement(DialogCloseButton, {
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(StyledOcticon, {
    icon: XIcon
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

export { Dialog };
