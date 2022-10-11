'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ButtonBase = require('./ButtonBase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ButtonComponent = /*#__PURE__*/React.forwardRef(({
  children,
  ...props
}, forwardedRef) => {
  return /*#__PURE__*/React__default["default"].createElement(ButtonBase.ButtonBase, _extends({
    ref: forwardedRef,
    as: "button"
  }, props), children);
});
ButtonComponent.displayName = 'Button';

exports.ButtonComponent = ButtonComponent;
