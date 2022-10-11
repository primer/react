import classnames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';
import getGlobalFocusStyles from './_getGlobalFocusStyles.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ITEM_CLASS = 'PRC-UnderlineNav-item';
const SELECTED_CLASS = 'PRC-selected';
const UnderlineNavBase = styled.nav.withConfig({
  displayName: "UnderlineNav__UnderlineNavBase",
  componentId: "sc-1lhwixe-0"
})(["display:flex;justify-content:space-between;border-bottom:1px solid ", ";&.PRC-UnderlineNav--right{justify-content:flex-end;.PRC-UnderlineNav-item{margin-right:0;margin-left:", ";}.PRC-UnderlineNav-actions{flex:1 1 auto;}}&.PRC-UnderlineNav--full{display:block;}.PRC-UnderlineNav-body{display:flex;margin-bottom:-1px;}.PRC-UnderlineNav-actions{align-self:center;}", ";"], get('colors.border.muted'), get('space.3'), sx);

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
  const classes = classnames(className, 'PRC-UnderlineNav', align && `PRC-UnderlineNav--${align}`, full && 'PRC-UnderlineNav--full');
  return /*#__PURE__*/React.createElement(UnderlineNavBase, _extends({
    className: classes,
    "aria-label": label,
    theme: theme
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "PRC-UnderlineNav-body"
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    className: "PRC-UnderlineNav-actions"
  }, actions));
}

UnderlineNav.displayName = "UnderlineNav";
const UnderlineNavLink = styled.a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
})).withConfig({
  displayName: "UnderlineNav__UnderlineNavLink",
  componentId: "sc-1lhwixe-1"
})(["padding:", " ", ";margin-right:", ";font-size:", ";line-height:", ";color:", ";text-align:center;border-bottom:2px solid transparent;text-decoration:none;&:hover,&:focus{color:", ";text-decoration:none;border-bottom-color:", ";transition:border-bottom-color 0.2s ease;.PRC-UnderlineNav-octicon{color:", ";}}&.PRC-selected{color:", ";border-bottom-color:", ";.PRC-UnderlineNav-octicon{color:", ";}}", ";", ";"], get('space.3'), get('space.2'), get('space.3'), get('fontSizes.1'), get('lineHeights.default'), get('colors.fg.default'), get('colors.fg.default'), get('colors.neutral.muted'), get('colors.fg.muted'), get('colors.fg.default'), get('colors.primer.border.active'), get('colors.fg.default'), getGlobalFocusStyles('-8px'), sx);
UnderlineNavLink.displayName = 'UnderlineNav.Link';
var UnderlineNav$1 = Object.assign(UnderlineNav, {
  Link: UnderlineNavLink
});

export { UnderlineNav$1 as default };
