'use strict';

var React = require('react');
var Box = require('./Box.js');
var _VisuallyHidden = require('./_VisuallyHidden.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const InputLabel = ({
  children,
  disabled,
  htmlFor,
  id,
  required,
  visuallyHidden,
  sx,
  as = 'label'
}) => {
  return /*#__PURE__*/React__default["default"].createElement(_VisuallyHidden, {
    isVisible: !visuallyHidden,
    as: as
    /* This assertion is clearly wrong, but it's the only way TS will allow the htmlFor prop to be possibly defined */
    ,
    htmlFor: htmlFor,
    id: id,
    sx: {
      fontWeight: 'bold',
      fontSize: 1,
      display: 'block',
      color: disabled ? 'fg.muted' : 'fg.default',
      cursor: disabled ? 'default' : 'pointer',
      alignSelf: 'flex-start',
      ...sx
    }
  }, required ? /*#__PURE__*/React__default["default"].createElement(Box, {
    display: "flex",
    as: "span"
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
    mr: 1
  }, children), /*#__PURE__*/React__default["default"].createElement("span", {
    "aria-hidden": "true"
  }, "*")) : children);
};

InputLabel.displayName = "InputLabel";

module.exports = InputLabel;
