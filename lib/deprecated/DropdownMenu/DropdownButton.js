'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
var Button = require('../Button/Button.js');
var StyledOcticon = require('../../StyledOcticon.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @deprecated Use Button with Octicons instead. See https://primer.style/react/drafts/Button2#appending-an-icon for more details.
 */
const DropdownButton = /*#__PURE__*/React__default["default"].forwardRef(({
  children,
  ...props
}, ref) => /*#__PURE__*/React__default["default"].createElement(Button, _extends({
  ref: ref,
  type: "button"
}, props), children, /*#__PURE__*/React__default["default"].createElement(StyledOcticon, {
  icon: octiconsReact.TriangleDownIcon,
  sx: {
    ml: 1
  }
})));

exports.DropdownButton = DropdownButton;
