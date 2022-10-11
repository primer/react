import React, { forwardRef, useMemo } from 'react';
import Box from '../Box.js';
import '../sx.js';
import { useTheme } from '../ThemeProvider.js';
import { StyledButton } from './types.js';
import { getButtonStyles, getSizeStyles, getVariantStyles } from './styles.js';
import merge from 'deepmerge';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const defaultSxProp = {};
const iconWrapStyles = {
  display: 'inline-block'
};
const trailingIconStyles = { ...iconWrapStyles,
  ml: 2
};
const ButtonBase = /*#__PURE__*/forwardRef(({
  children,
  as: Component = 'button',
  sx: sxProp = defaultSxProp,
  ...props
}, forwardedRef) => {
  const {
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    variant = 'default',
    size = 'medium'
  } = props;
  const {
    theme
  } = useTheme();
  const baseStyles = useMemo(() => {
    return merge.all([getButtonStyles(theme), getSizeStyles(size, variant, false), getVariantStyles(variant, theme)]);
  }, [theme, size, variant]);
  const sxStyles = useMemo(() => {
    return merge(baseStyles, sxProp);
  }, [baseStyles, sxProp]);
  return /*#__PURE__*/React.createElement(StyledButton, _extends({
    as: Component,
    sx: sxStyles
  }, props, {
    ref: forwardedRef
  }), LeadingIcon && /*#__PURE__*/React.createElement(Box, {
    as: "span",
    "data-component": "leadingIcon",
    sx: iconWrapStyles
  }, /*#__PURE__*/React.createElement(LeadingIcon, null)), children && /*#__PURE__*/React.createElement("span", {
    "data-component": "text"
  }, children), TrailingIcon && /*#__PURE__*/React.createElement(Box, {
    as: "span",
    "data-component": "trailingIcon",
    sx: trailingIconStyles
  }, /*#__PURE__*/React.createElement(TrailingIcon, null)));
});

export { ButtonBase };
