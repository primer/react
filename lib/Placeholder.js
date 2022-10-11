'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Box = require('./Box.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** Private component used to render placeholders in storybook and documentation examples  */

const Placeholder = ({
  width,
  height,
  id,
  label
}) => {
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    id: id,
    sx: {
      width: width !== null && width !== void 0 ? width : '100%',
      height,
      display: 'grid',
      placeItems: 'center',
      bg: 'canvas.inset',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'border.subtle'
    }
  }, label);
};
Placeholder.displayName = "Placeholder";

exports.Placeholder = Placeholder;
