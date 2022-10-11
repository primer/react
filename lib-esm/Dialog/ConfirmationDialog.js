import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Box from '../Box.js';
import { useTheme, ThemeProvider } from '../ThemeProvider.js';
import { FocusKeys } from '@primer/behaviors';
import { get } from '../constants.js';
import { Dialog } from './Dialog.js';
import { useFocusZone } from '../hooks/useFocusZone.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * Props to customize the ConfirmationDialog.
 */

const StyledConfirmationHeader = styled.header.withConfig({
  displayName: "ConfirmationDialog__StyledConfirmationHeader",
  componentId: "sc-vurs1e-0"
})(["padding:", ";display:flex;flex-direction:row;"], get('space.2'));
const StyledTitle = styled(Box).attrs({
  as: 'h1'
}).withConfig({
  displayName: "ConfirmationDialog__StyledTitle",
  componentId: "sc-vurs1e-1"
})(["font-size:", ";font-weight:", ";padding:6px ", ";flex-grow:1;margin:0;"], get('fontSizes.3'), get('fontWeights.bold'), get('space.2'));

const ConfirmationHeader = ({
  title,
  onClose,
  dialogLabelId
}) => {
  const onCloseClick = useCallback(() => {
    onClose('close-button');
  }, [onClose]);
  return /*#__PURE__*/React.createElement(StyledConfirmationHeader, null, /*#__PURE__*/React.createElement(StyledTitle, {
    id: dialogLabelId
  }, title), /*#__PURE__*/React.createElement(Dialog.CloseButton, {
    onClose: onCloseClick
  }));
};

ConfirmationHeader.displayName = "ConfirmationHeader";
const StyledConfirmationBody = styled(Box).withConfig({
  displayName: "ConfirmationDialog__StyledConfirmationBody",
  componentId: "sc-vurs1e-2"
})(["font-size:", ";padding:0 ", " ", " ", ";color:", ";flex-grow:1;"], get('fontSizes.1'), get('space.3'), get('space.3'), get('space.3'), get('colors.fg.muted'));

const ConfirmationBody = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(StyledConfirmationBody, null, children);
};

ConfirmationBody.displayName = "ConfirmationBody";
const StyledConfirmationFooter = styled(Box).withConfig({
  displayName: "ConfirmationDialog__StyledConfirmationFooter",
  componentId: "sc-vurs1e-3"
})(["display:grid;grid-auto-flow:column;grid-auto-columns:max-content;grid-gap:", ";align-items:end;justify-content:end;padding:", " ", " ", ";"], get('space.2'), get('space.1'), get('space.3'), get('space.3'));

const ConfirmationFooter = ({
  footerButtons
}) => {
  const {
    containerRef: footerRef
  } = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest'
  }); // Must have exactly 2 buttons!

  return /*#__PURE__*/React.createElement(StyledConfirmationFooter, {
    ref: footerRef
  }, /*#__PURE__*/React.createElement(Dialog.Buttons, {
    buttons: footerButtons !== null && footerButtons !== void 0 ? footerButtons : []
  }));
};

ConfirmationFooter.displayName = "ConfirmationFooter";

/**
 * A ConfirmationDialog is a special kind of dialog with more rigid behavior. It
 * is used to confirm a user action. ConfirmationDialogs always have exactly
 * two buttons: one to cancel the action and one to confirm it. No custom
 * rendering capabilities are provided for ConfirmationDialog.
 */
const ConfirmationDialog = props => {
  const {
    onClose,
    title,
    cancelButtonContent = 'Cancel',
    confirmButtonContent = 'OK',
    confirmButtonType = 'normal',
    children
  } = props;
  const onCancelButtonClick = useCallback(() => {
    onClose('cancel');
  }, [onClose]);
  const onConfirmButtonClick = useCallback(() => {
    onClose('confirm');
  }, [onClose]);
  const isConfirmationDangerous = confirmButtonType === 'danger';
  const cancelButton = {
    content: cancelButtonContent,
    onClick: onCancelButtonClick,
    autoFocus: isConfirmationDangerous
  };
  const confirmButton = {
    content: confirmButtonContent,
    buttonType: confirmButtonType,
    onClick: onConfirmButtonClick,
    autoFocus: !isConfirmationDangerous
  };
  const footerButtons = [cancelButton, confirmButton];
  return /*#__PURE__*/React.createElement(Dialog, {
    onClose: onClose,
    title: title,
    footerButtons: footerButtons,
    role: "alertdialog",
    width: "medium",
    renderHeader: ConfirmationHeader,
    renderBody: ConfirmationBody,
    renderFooter: ConfirmationFooter
  }, children);
};
ConfirmationDialog.displayName = "ConfirmationDialog";

async function confirm(themeProps, options) {
  const {
    content,
    ...confirmationDialogProps
  } = options;
  return new Promise(resolve => {
    const hostElement = document.createElement('div');

    const onClose = gesture => {
      ReactDOM.unmountComponentAtNode(hostElement);

      if (gesture === 'confirm') {
        resolve(true);
      } else {
        resolve(false);
      }
    };

    ReactDOM.render( /*#__PURE__*/React.createElement(ThemeProvider, themeProps, /*#__PURE__*/React.createElement(ConfirmationDialog, _extends({}, confirmationDialogProps, {
      onClose: onClose
    }), content)), hostElement);
  });
}
/**
 * This hook takes no parameters and returns an `async` function, `confirm`. When `confirm`
 * is called, it shows the confirmation dialog. When the dialog is dismissed, a promise is
 * resolved with `true` or `false` depending on whether or not the confirm button was used.
 */


function useConfirm() {
  const {
    theme,
    colorMode,
    dayScheme,
    nightScheme
  } = useTheme();
  const result = useCallback(options => {
    const themeProps = {
      theme,
      colorMode,
      dayScheme,
      nightScheme
    };
    return confirm(themeProps, options);
  }, [theme, colorMode, dayScheme, nightScheme]);
  return result;
}

export { ConfirmationDialog, useConfirm };
