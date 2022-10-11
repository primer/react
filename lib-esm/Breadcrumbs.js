import classnames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import Box from './Box.js';
import { get } from './constants.js';
import sx from './sx.js';

const SELECTED_CLASS = 'selected';
const Wrapper = styled.li.withConfig({
  displayName: "Breadcrumbs__Wrapper",
  componentId: "sc-zwknu7-0"
})(["display:inline-block;white-space:nowrap;list-style:none;&::after{padding-right:0.5em;padding-left:0.5em;color:", ";font-size:", ";content:'/';}&:first-child{margin-left:0;}&:last-child{&::after{content:none;}}"], get('colors.fg.muted'), get('fontSizes.1'));
const BreadcrumbsBase = styled.nav.withConfig({
  displayName: "Breadcrumbs__BreadcrumbsBase",
  componentId: "sc-zwknu7-1"
})(["display:flex;justify-content:space-between;", ";"], sx);

function Breadcrumbs({
  className,
  children,
  sx: sxProp
}) {
  const wrappedChildren = React.Children.map(children, child => /*#__PURE__*/React.createElement(Wrapper, null, child));
  return /*#__PURE__*/React.createElement(BreadcrumbsBase, {
    className: className,
    "aria-label": "Breadcrumbs",
    sx: sxProp
  }, /*#__PURE__*/React.createElement(Box, {
    as: "ol",
    my: 0,
    pl: 0
  }, wrappedChildren));
}

Breadcrumbs.displayName = "Breadcrumbs";
const BreadcrumbsItem = styled.a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(props.selected && SELECTED_CLASS, props.className),
  'aria-current': props.selected ? 'page' : null
})).withConfig({
  displayName: "Breadcrumbs__BreadcrumbsItem",
  componentId: "sc-zwknu7-2"
})(["color:", ";display:inline-block;font-size:", ";text-decoration:none;&:hover{text-decoration:underline;}&.selected{color:", ";pointer-events:none;}", ";"], get('colors.accent.fg'), get('fontSizes.1'), get('colors.fg.default'), sx);
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

export { Breadcrumb, Breadcrumbs$1 as default };
