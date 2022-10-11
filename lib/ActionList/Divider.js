'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Box = require('../Box.js');
var constants = require('../constants.js');
require('@styled-system/css');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
const Divider = ({
  sx = {}
}) => {
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "li",
    "aria-hidden": "true",
    sx: merge__default["default"]({
      height: 1,
      backgroundColor: 'actionListItem.inlineDivider',
      marginTop: theme => `calc(${constants.get('space.2')(theme)} - 1px)`,
      marginBottom: 2,
      listStyle: 'none' // hide the ::marker inserted by browser's stylesheet

    }, sx),
    "data-component": "ActionList.Divider"
  });
};
Divider.displayName = "Divider";

exports.Divider = Divider;
