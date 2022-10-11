'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const FilterListBase = styled__default["default"].ul.withConfig({
  displayName: "FilterList__FilterListBase",
  componentId: "sc-14vymk5-0"
})(["list-style-type:none;margin:0;padding:0;", ";"], sx["default"]);

const FilterList = ({
  children,
  ...rest
}) => {
  const items = React__default["default"].Children.map(children, child => {
    return /*#__PURE__*/React__default["default"].createElement("li", null, child);
  });
  return /*#__PURE__*/React__default["default"].createElement(FilterListBase, rest, items);
};

FilterList.displayName = "FilterList";
const FilterListItemBase = styled__default["default"].a.withConfig({
  displayName: "FilterList__FilterListItemBase",
  componentId: "sc-14vymk5-1"
})(["position:relative;display:block;padding:", ";margin:", ";overflow:hidden;font-size:", ";color:", ";background-color:", "!important;text-decoration:none;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;border-radius:", ";&:hover{text-decoration:none;background-color:", ";}&:active{color:", ";background-color:", ";}.count{float:right;font-weight:", ";}", ";"], props => props.small ? `${constants.get('space.1')(props)} 10px` : `${constants.get('space.2')(props)} 11px`, props => props.small ? '0 0 2px' : '0 0 5px 0', constants.get('fontSizes.1'), props => props.selected ? constants.get('colors.fg.onEmphasis') : constants.get('colors.fg.muted'), props => props.selected ? constants.get('colors.accent.emphasis') : '', constants.get('radii.1'), constants.get('colors.canvas.subtle'), constants.get('colors.fg.onEmphasis'), constants.get('colors.accent.emphasis'), constants.get('fontWeights.bold'), sx["default"]);

function FilterListItem({
  children,
  count,
  ...rest
}) {
  return /*#__PURE__*/React__default["default"].createElement(FilterListItemBase, rest, count && /*#__PURE__*/React__default["default"].createElement("span", {
    title: "results",
    className: "count"
  }, count), children);
}

FilterListItem.displayName = "FilterListItem";
FilterListItem.displayName = 'FilterList.Item';
var FilterList$1 = Object.assign(FilterList, {
  Item: FilterListItem
});

module.exports = FilterList$1;
