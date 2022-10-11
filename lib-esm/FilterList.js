import React from 'react';
import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const FilterListBase = styled.ul.withConfig({
  displayName: "FilterList__FilterListBase",
  componentId: "sc-14vymk5-0"
})(["list-style-type:none;margin:0;padding:0;", ";"], sx);

const FilterList = ({
  children,
  ...rest
}) => {
  const items = React.Children.map(children, child => {
    return /*#__PURE__*/React.createElement("li", null, child);
  });
  return /*#__PURE__*/React.createElement(FilterListBase, rest, items);
};

FilterList.displayName = "FilterList";
const FilterListItemBase = styled.a.withConfig({
  displayName: "FilterList__FilterListItemBase",
  componentId: "sc-14vymk5-1"
})(["position:relative;display:block;padding:", ";margin:", ";overflow:hidden;font-size:", ";color:", ";background-color:", "!important;text-decoration:none;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;border-radius:", ";&:hover{text-decoration:none;background-color:", ";}&:active{color:", ";background-color:", ";}.count{float:right;font-weight:", ";}", ";"], props => props.small ? `${get('space.1')(props)} 10px` : `${get('space.2')(props)} 11px`, props => props.small ? '0 0 2px' : '0 0 5px 0', get('fontSizes.1'), props => props.selected ? get('colors.fg.onEmphasis') : get('colors.fg.muted'), props => props.selected ? get('colors.accent.emphasis') : '', get('radii.1'), get('colors.canvas.subtle'), get('colors.fg.onEmphasis'), get('colors.accent.emphasis'), get('fontWeights.bold'), sx);

function FilterListItem({
  children,
  count,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(FilterListItemBase, rest, count && /*#__PURE__*/React.createElement("span", {
    title: "results",
    className: "count"
  }, count), children);
}

FilterListItem.displayName = "FilterListItem";
FilterListItem.displayName = 'FilterList.Item';
var FilterList$1 = Object.assign(FilterList, {
  Item: FilterListItem
});

export { FilterList$1 as default };
