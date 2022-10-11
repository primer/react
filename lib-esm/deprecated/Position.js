import React from 'react';
import styled from 'styled-components';
import Box from '../Box.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @deprecated Use the Box component instead (i.e. <Position> → <Box>)
 */
const Position = styled(Box).withConfig({
  displayName: "Position",
  componentId: "sc-1qlzjcz-0"
})([""]);

/**
 * @deprecated Use the Box component instead (i.e. <Absolute> → <Box position="absolute">)
 */
var Position$1 = Position; // Absolute

/**
 * @deprecated Use the Box component instead (i.e. <Absolute> → <Box position="absolute">)
 */
const Absolute = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(Position, _extends({}, props, {
    position: "absolute",
    ref: ref
  }));
});
Absolute.displayName = 'Absolute'; // Fixed

/**
 * @deprecated Use the Box component instead (i.e. <Fixed> → <Box position="fixed">)
 */
const Fixed = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(Position, _extends({}, props, {
    position: "fixed",
    ref: ref
  }));
});
Fixed.displayName = 'Fixed'; // Relative

/**
 * @deprecated Use the Box component instead (i.e. <Relative> → <Box position="relative">)
 */
const Relative = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(Position, _extends({}, props, {
    position: "relative",
    ref: ref
  }));
});
Relative.displayName = 'Relative'; // Sticky

/**
 * @deprecated Use the Box component instead (i.e. <Sticky> → <Box position="sticky">)
 */
const Sticky = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(Position, _extends({}, props, {
    position: "sticky",
    ref: ref
  }));
});
Sticky.defaultProps = {
  top: 0,
  zIndex: 1
};
Sticky.displayName = 'Sticky';

export { Absolute, Fixed, Relative, Sticky, Position$1 as default };
