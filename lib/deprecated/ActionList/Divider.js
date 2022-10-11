'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const StyledDivider = styled__default["default"].div.withConfig({
  displayName: "Divider__StyledDivider",
  componentId: "sc-1s7tlfq-0"
})(["height:1px;background:", ";margin-top:calc(", " - 1px);margin-bottom:", ";"], constants.get('colors.border.muted'), constants.get('space.2'), constants.get('space.2'));
/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */

function Divider() {
  return /*#__PURE__*/React__default["default"].createElement(StyledDivider, null);
}
Divider.displayName = "Divider";

/**
 * `Divider` fulfills the `ItemPropsWithCustomRenderer` contract,
 * so it can be used inline in an `ActionList`’s `items` prop.
 * In other words, `items={[ActionList.Divider]}` is supported as a concise
 * alternative to `items={[{renderItem: () => <ActionList.Divider />}]}`.
 */
Divider.renderItem = Divider;

exports.Divider = Divider;
exports.StyledDivider = StyledDivider;
