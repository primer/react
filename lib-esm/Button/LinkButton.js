import React, { forwardRef } from 'react';
import '../sx.js';
import { ButtonBase } from './ButtonBase.js';
import merge from 'deepmerge';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const LinkButton = /*#__PURE__*/forwardRef(({
  children,
  as: Component = 'a',
  sx = {},
  ...props
}, forwardedRef) => {
  const style = {
    width: 'fit-content',
    '&:hover:not([disabled])': {
      textDecoration: 'underline'
    },
    // focus must come before :active so that the active box shadow overrides
    '&:focus:not([disabled])': {
      textDecoration: 'underline'
    },
    '&:active:not([disabled])': {
      textDecoration: 'underline'
    }
  };
  const sxStyle = merge.all([style, sx]);
  return /*#__PURE__*/React.createElement(ButtonBase, _extends({
    as: Component,
    ref: forwardedRef,
    sx: sxStyle
  }, props), children);
});

export { LinkButton };
