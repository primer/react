import React, { forwardRef } from 'react';
import Box from './Box.js';
import { Button } from './Button/index.js';
import Tooltip from './Tooltip.js';
import '@styled-system/css';
import merge from 'deepmerge';
import { IconButton } from './Button/IconButton.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const invisibleButtonStyleOverrides = {
  color: 'fg.default',
  paddingTop: '2px',
  paddingRight: '4px',
  paddingBottom: '2px',
  paddingLeft: '4px',
  position: 'relative',
  '@media (pointer: coarse)': {
    ':after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      top: '50%',
      minHeight: '44px'
    }
  }
};

const ConditionalTooltip = ({
  'aria-label': ariaLabel,
  children
}) => /*#__PURE__*/React.createElement(React.Fragment, null, ariaLabel ? /*#__PURE__*/React.createElement(Tooltip, {
  "aria-label": ariaLabel,
  sx: {
    /* inline-block is used to ensure the tooltip dimensions don't
       collapse when being used with `grid` or `inline` children */
    display: 'inline-block'
  }
}, children) : children);

const TextInputAction = /*#__PURE__*/forwardRef(({
  'aria-label': ariaLabel,
  children,
  icon,
  sx: sxProp,
  variant,
  ...rest
}, forwardedRef) => {
  const sx = variant === 'invisible' ? merge(invisibleButtonStyleOverrides, sxProp || {}) : sxProp || {};

  if (icon && !ariaLabel || !children && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology');
  }

  return /*#__PURE__*/React.createElement(Box, {
    as: "span",
    className: "TextInput-action",
    margin: 1
  }, icon && !children ? /*#__PURE__*/React.createElement(Tooltip, {
    "aria-label": ariaLabel
  }, /*#__PURE__*/React.createElement(IconButton, _extends({
    variant: variant,
    type: "button",
    icon: icon,
    "aria-label": ariaLabel,
    size: "small",
    sx: sx
  }, rest, {
    ref: forwardedRef
  }))) : /*#__PURE__*/React.createElement(ConditionalTooltip, {
    "aria-label": ariaLabel
  }, /*#__PURE__*/React.createElement(Button, _extends({
    variant: variant,
    size: "small",
    type: "button",
    sx: sx
  }, rest, {
    ref: forwardedRef
  }), children)));
});
TextInputAction.defaultProps = {
  variant: 'invisible'
};

export { TextInputAction as default };
