import React from 'react';
import Box from './Box.js';
import StyledSpinner from './Spinner.js';

const TextInputInnerVisualSlot = ({
  children,
  hasLoadingIndicator,
  showLoadingIndicator,
  visualPosition
}) => {
  if (!children && !hasLoadingIndicator || visualPosition === 'leading' && !children && !showLoadingIndicator) {
    return null;
  }

  if (!hasLoadingIndicator) {
    return /*#__PURE__*/React.createElement("span", {
      className: "TextInput-icon"
    }, children);
  }

  return /*#__PURE__*/React.createElement("span", {
    className: "TextInput-icon"
  }, /*#__PURE__*/React.createElement(Box, {
    display: "flex",
    position: "relative"
  }, children && /*#__PURE__*/React.createElement(Box, {
    sx: {
      visibility: showLoadingIndicator ? 'hidden' : 'visible'
    }
  }, children), /*#__PURE__*/React.createElement(StyledSpinner, {
    sx: children ? {
      position: 'absolute',
      top: 0,
      height: '100%',
      maxWidth: '100%',
      visibility: showLoadingIndicator ? 'visible' : 'hidden',
      ...(visualPosition === 'leading' ? {
        left: 0
      } : {
        right: 0
      })
    } : {
      visibility: showLoadingIndicator ? 'visible' : 'hidden'
    },
    size: children ? undefined : 'small'
  })));
};

TextInputInnerVisualSlot.displayName = "TextInputInnerVisualSlot";

export { TextInputInnerVisualSlot as default };
