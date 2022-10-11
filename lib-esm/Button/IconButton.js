import React, { forwardRef } from 'react';
import '@styled-system/css';
import merge from 'deepmerge';
import { useTheme } from '../ThemeProvider.js';
import Box from '../Box.js';
import { StyledButton } from './types.js';
import { getBaseStyles, getSizeStyles, getVariantStyles } from './styles.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const IconButton = /*#__PURE__*/forwardRef((props, forwardedRef) => {
  const {
    variant = 'default',
    size = 'medium',
    sx: sxProp = {},
    icon: Icon,
    ...rest
  } = props;
  const {
    theme
  } = useTheme();
  const sxStyles = merge.all([getBaseStyles(theme), getSizeStyles(size, variant, true), getVariantStyles(variant, theme), sxProp]);
  return /*#__PURE__*/React.createElement(StyledButton, _extends({
    sx: sxStyles
  }, rest, {
    ref: forwardedRef
  }), /*#__PURE__*/React.createElement(Box, {
    as: "span",
    sx: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement(Icon, null)));
});

export { IconButton };
