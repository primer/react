'use strict';

var classnames = require('classnames');
var React = require('react');
var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');
var _getGlobalFocusStyles = require('./_getGlobalFocusStyles.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ITEM_CLASS = 'PRC-UnderlineNav-item';
const SELECTED_CLASS = 'PRC-selected';
const UnderlineNavBase = styled__default["default"].nav.withConfig({
  displayName: "UnderlineNav__UnderlineNavBase",
  componentId: "sc-1lhwixe-0"
})(["display:flex;justify-content:space-between;border-bottom:1px solid ", ";&.PRC-UnderlineNav--right{justify-content:flex-end;.PRC-UnderlineNav-item{margin-right:0;margin-left:", ";}.PRC-UnderlineNav-actions{flex:1 1 auto;}}&.PRC-UnderlineNav--full{display:block;}.PRC-UnderlineNav-body{display:flex;margin-bottom:-1px;}.PRC-UnderlineNav-actions{align-self:center;}", ";"], constants.get('colors.border.muted'), constants.get('space.3'), sx["default"]);

function UnderlineNav({
  actions,
  className,
  align,
  children,
  full,
  label,
  theme,
  ...rest
}) {
  const classes = classnames__default["default"](className, 'PRC-UnderlineNav', align && `PRC-UnderlineNav--${align}`, full && 'PRC-UnderlineNav--full');
  return /*#__PURE__*/React__default["default"].createElement(UnderlineNavBase, _extends({
    className: classes,
    "aria-label": label,
    theme: theme
  }, rest), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "PRC-UnderlineNav-body"
  }, children), actions && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "PRC-UnderlineNav-actions"
  }, actions));
}

UnderlineNav.displayName = "UnderlineNav";
const UnderlineNavLink = styled__default["default"].a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames__default["default"](ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
})).withConfig({
  displayName: "UnderlineNav__UnderlineNavLink",
  componentId: "sc-1lhwixe-1"
})(["padding:", " ", ";margin-right:", ";font-size:", ";line-height:", ";color:", ";text-align:center;border-bottom:2px solid transparent;text-decoration:none;&:hover,&:focus{color:", ";text-decoration:none;border-bottom-color:", ";transition:border-bottom-color 0.2s ease;.PRC-UnderlineNav-octicon{color:", ";}}&.PRC-selected{color:", ";border-bottom-color:", ";.PRC-UnderlineNav-octicon{color:", ";}}", ";", ";"], constants.get('space.3'), constants.get('space.2'), constants.get('space.3'), constants.get('fontSizes.1'), constants.get('lineHeights.default'), constants.get('colors.fg.default'), constants.get('colors.fg.default'), constants.get('colors.neutral.muted'), constants.get('colors.fg.muted'), constants.get('colors.fg.default'), constants.get('colors.primer.border.active'), constants.get('colors.fg.default'), _getGlobalFocusStyles('-8px'), sx["default"]);
UnderlineNavLink.displayName = 'UnderlineNav.Link';
var UnderlineNav$1 = Object.assign(UnderlineNav, {
  Link: UnderlineNavLink
});

module.exports = UnderlineNav$1;
