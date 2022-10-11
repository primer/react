import React from 'react';
import CounterLabel from '../CounterLabel.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Counter = ({
  children,
  sx: sxProp = {},
  ...props
}) => {
  return /*#__PURE__*/React.createElement(CounterLabel, _extends({
    "data-component": "ButtonCounter",
    sx: {
      ml: 2,
      ...sxProp
    }
  }, props), children);
};

Counter.displayName = "Counter";

export { Counter };
