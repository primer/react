import React from 'react';
import Box from './Box.js';
import Caret from './Caret.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function PointerBox(props) {
  // don't destructure these, just grab them
  const {
    bg,
    border,
    borderColor,
    theme,
    sx
  } = props;
  const {
    caret,
    children,
    ...boxProps
  } = props;
  const caretProps = {
    bg: bg || (sx === null || sx === void 0 ? void 0 : sx.bg) || (sx === null || sx === void 0 ? void 0 : sx.backgroundColor),
    borderColor: borderColor || (sx === null || sx === void 0 ? void 0 : sx.borderColor),
    borderWidth: border,
    location: caret,
    theme
  };
  const defaultBoxProps = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'border.default',
    borderRadius: 2
  };
  return /*#__PURE__*/React.createElement(Box, _extends({}, defaultBoxProps, boxProps, {
    sx: { ...sx,
      position: 'relative'
    }
  }), children, /*#__PURE__*/React.createElement(Caret, caretProps));
}

PointerBox.displayName = "PointerBox";

export { PointerBox as default };
