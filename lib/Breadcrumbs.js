'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var classnames = require('classnames');
var React = require('react');
var styled = require('styled-components');
var Box = require('./Box.js');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const SELECTED_CLASS = 'selected';
const Wrapper = styled__default["default"].li.withConfig({
  displayName: "Breadcrumbs__Wrapper",
  componentId: "sc-zwknu7-0"
})(["display:inline-block;white-space:nowrap;list-style:none;&::after{padding-right:0.5em;padding-left:0.5em;color:", ";font-size:", ";content:'/';}&:first-child{margin-left:0;}&:last-child{&::after{content:none;}}"], constants.get('colors.fg.muted'), constants.get('fontSizes.1'));
const BreadcrumbsBase = styled__default["default"].nav.withConfig({
  displayName: "Breadcrumbs__BreadcrumbsBase",
  componentId: "sc-zwknu7-1"
})(["display:flex;justify-content:space-between;", ";"], sx["default"]);

function Breadcrumbs({
  className,
  children,
  sx: sxProp
}) {
  const wrappedChildren = React__default["default"].Children.map(children, child => /*#__PURE__*/React__default["default"].createElement(Wrapper, null, child));
  return /*#__PURE__*/React__default["default"].createElement(BreadcrumbsBase, {
    className: className,
    "aria-label": "Breadcrumbs",
    sx: sxProp
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "ol",
    my: 0,
    pl: 0
  }, wrappedChildren));
}

Breadcrumbs.displayName = "Breadcrumbs";
const BreadcrumbsItem = styled__default["default"].a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames__default["default"](props.selected && SELECTED_CLASS, props.className),
  'aria-current': props.selected ? 'page' : null
})).withConfig({
  displayName: "Breadcrumbs__BreadcrumbsItem",
  componentId: "sc-zwknu7-2"
})(["color:", ";display:inline-block;font-size:", ";text-decoration:none;&:hover{text-decoration:underline;}&.selected{color:", ";pointer-events:none;}", ";"], constants.get('colors.accent.fg'), constants.get('fontSizes.1'), constants.get('colors.fg.default'), sx["default"]);
Breadcrumbs.displayName = 'Breadcrumbs';
BreadcrumbsItem.displayName = 'Breadcrumbs.Item';
var Breadcrumbs$1 = Object.assign(Breadcrumbs, {
  Item: BreadcrumbsItem
});
/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */

const Breadcrumb = Object.assign(Breadcrumbs, {
  Item: BreadcrumbsItem
});
/**
 * @deprecated Use the `BreadcrumbsProps` type instead
 */

exports.Breadcrumb = Breadcrumb;
exports["default"] = Breadcrumbs$1;
