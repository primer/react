import React from 'react';
import Box from './Box.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function CircleOcticon(props) {
  const {
    size,
    as
  } = props;
  const {
    icon: IconComponent,
    bg,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(Box, {
    as: as,
    bg: bg,
    overflow: "hidden",
    borderWidth: 0,
    size: size,
    borderRadius: "50%",
    borderStyle: "solid",
    borderColor: "border.default"
  }, /*#__PURE__*/React.createElement(Box, _extends({
    display: "flex"
  }, rest, {
    alignItems: "center",
    justifyContent: "center"
  }), /*#__PURE__*/React.createElement(IconComponent, {
    size: size
  })));
}

CircleOcticon.displayName = "CircleOcticon";
CircleOcticon.defaultProps = { ...Box.defaultProps,
  size: 32
};

export { CircleOcticon as default };
