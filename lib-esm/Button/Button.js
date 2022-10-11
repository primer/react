import React, { forwardRef } from 'react';
import { ButtonBase } from './ButtonBase.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ButtonComponent = /*#__PURE__*/forwardRef(({
  children,
  ...props
}, forwardedRef) => {
  return /*#__PURE__*/React.createElement(ButtonBase, _extends({
    ref: forwardedRef,
    as: "button"
  }, props), children);
});
ButtonComponent.displayName = 'Button';

export { ButtonComponent };
