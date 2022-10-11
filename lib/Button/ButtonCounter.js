'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var CounterLabel = require('../CounterLabel.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Counter = ({
  children,
  sx: sxProp = {},
  ...props
}) => {
  return /*#__PURE__*/React__default["default"].createElement(CounterLabel, _extends({
    "data-component": "ButtonCounter",
    sx: {
      ml: 2,
      ...sxProp
    }
  }, props), children);
};

Counter.displayName = "Counter";

exports.Counter = Counter;
