'use strict';

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var Box = require('./Box.js');
var Text = require('./Text.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const validationIconMap = {
  success: octiconsReact.CheckCircleFillIcon,
  error: octiconsReact.AlertFillIcon,
  warning: octiconsReact.AlertFillIcon
};
const validationColorMap = {
  success: 'success.fg',
  error: 'danger.fg',
  warning: 'attention.fg'
};

const InputValidation = ({
  children,
  id,
  validationStatus,
  sx
}) => {
  const IconComponent = validationStatus ? validationIconMap[validationStatus] : undefined;
  const fgColor = validationStatus ? validationColorMap[validationStatus] : undefined;
  return /*#__PURE__*/React__default["default"].createElement(Text, {
    sx: {
      fontSize: 0,
      fontWeight: 'bold',
      alignItems: 'center',
      color: fgColor,
      display: 'flex',
      a: {
        color: 'currentColor',
        textDecoration: 'underline'
      },
      ...sx
    }
  }, IconComponent && /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    mr: 1,
    sx: {
      display: 'flex'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React__default["default"].createElement(IconComponent, {
    size: 12,
    fill: "currentColor"
  })), /*#__PURE__*/React__default["default"].createElement("span", {
    id: id
  }, children));
};

InputValidation.displayName = "InputValidation";
var InputValidation$1 = InputValidation;

module.exports = InputValidation$1;
