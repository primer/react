'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const tabWrapperStyles = styled.css(["display:flex;flex-shrink:0;margin-bottom:-1px;-webkit-overflow-scrolling:touch;overflow-x:auto;overflow-y:hidden;&::-webkit-scrollbar{display:none;}@media (min-width:", "){padding:0 ", ";margin-top:", ";}"], constants.get('breakpoints.0'), constants.get('space.2'), constants.get('space.3'));
const SelectMenuTabsBase = styled__default["default"].div.withConfig({
  displayName: "SelectMenuTabs__SelectMenuTabsBase",
  componentId: "sc-qlz4ye-0"
})(["", " ", ";"], tabWrapperStyles, sx["default"]);

const SelectMenuTabs = ({
  children,
  ...rest
}) => {
  return /*#__PURE__*/React__default["default"].createElement(SelectMenuTabsBase, _extends({
    role: "tablist"
  }, rest), children);
};

SelectMenuTabs.displayName = "SelectMenuTabs";
SelectMenuTabs.displayName = 'SelectMenu.Tabs';
var SelectMenuTabs$1 = SelectMenuTabs;

module.exports = SelectMenuTabs$1;
