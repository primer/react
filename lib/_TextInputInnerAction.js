'use strict';

var React = require('react');
var Box = require('./Box.js');
var index = require('./Button/index.js');
var Tooltip = require('./Tooltip.js');
require('./sx.js');
var IconButton = require('./Button/IconButton.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

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
}) => /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, ariaLabel ? /*#__PURE__*/React__default["default"].createElement(Tooltip, {
  "aria-label": ariaLabel,
  sx: {
    /* inline-block is used to ensure the tooltip dimensions don't
       collapse when being used with `grid` or `inline` children */
    display: 'inline-block'
  }
}, children) : children);

const TextInputAction = /*#__PURE__*/React.forwardRef(({
  'aria-label': ariaLabel,
  children,
  icon,
  sx: sxProp,
  variant,
  ...rest
}, forwardedRef) => {
  const sx = variant === 'invisible' ? merge__default["default"](invisibleButtonStyleOverrides, sxProp || {}) : sxProp || {};

  if (icon && !ariaLabel || !children && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology');
  }

  return /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    className: "TextInput-action",
    margin: 1
  }, icon && !children ? /*#__PURE__*/React__default["default"].createElement(Tooltip, {
    "aria-label": ariaLabel
  }, /*#__PURE__*/React__default["default"].createElement(IconButton.IconButton, _extends({
    variant: variant,
    type: "button",
    icon: icon,
    "aria-label": ariaLabel,
    size: "small",
    sx: sx
  }, rest, {
    ref: forwardedRef
  }))) : /*#__PURE__*/React__default["default"].createElement(ConditionalTooltip, {
    "aria-label": ariaLabel
  }, /*#__PURE__*/React__default["default"].createElement(index.Button, _extends({
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
var TextInputAction$1 = TextInputAction;

module.exports = TextInputAction$1;
