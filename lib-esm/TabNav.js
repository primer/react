import classnames from 'classnames';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { get } from './constants.js';
import { useFocusZone } from './hooks/useFocusZone.js';
import sx from './sx.js';
import getGlobalFocusStyles from './_getGlobalFocusStyles.js';
import { FocusKeys } from '@primer/behaviors';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ITEM_CLASS = 'TabNav-item';
const SELECTED_CLASS = 'selected';
const TabNavBase = styled.div.withConfig({
  displayName: "TabNav__TabNavBase",
  componentId: "sc-1ab407u-0"
})(["", ""], sx);
const TabNavTabList = styled.div.withConfig({
  displayName: "TabNav__TabNavTabList",
  componentId: "sc-1ab407u-1"
})(["display:flex;margin-bottom:-1px;overflow:auto;"]);
const TabNavNav = styled.nav.withConfig({
  displayName: "TabNav__TabNavNav",
  componentId: "sc-1ab407u-2"
})(["margin-top:0;border-bottom:1px solid ", ";"], get('colors.border.default'));

function TabNav({
  children,
  'aria-label': ariaLabel,
  ...rest
}) {
  const customContainerRef = useRef(null);
  const customStrategy = React.useCallback(() => {
    if (customContainerRef.current) {
      const tabs = Array.from(customContainerRef.current.querySelectorAll('[role=tab][aria-selected=true]'));
      return tabs[0];
    }
  }, [customContainerRef]);
  const {
    containerRef: navRef
  } = useFocusZone({
    containerRef: customContainerRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap',
    focusInStrategy: customStrategy,
    focusableElementFilter: element => element.getAttribute('role') === 'tab'
  });
  return /*#__PURE__*/React.createElement(TabNavBase, _extends({}, rest, {
    ref: navRef
  }), /*#__PURE__*/React.createElement(TabNavNav, {
    "aria-label": ariaLabel
  }, /*#__PURE__*/React.createElement(TabNavTabList, {
    role: "tablist"
  }, children)));
}

TabNav.displayName = "TabNav";
const TabNavLink = styled.a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
  role: 'tab',
  'aria-selected': !!props.selected,
  tabIndex: -1
})).withConfig({
  displayName: "TabNav__TabNavLink",
  componentId: "sc-1ab407u-3"
})(["padding:8px 12px;font-size:", ";line-height:20px;color:", ";text-decoration:none;background-color:transparent;border:1px solid transparent;border-bottom:0;", ";&:hover,&:focus{color:", ";text-decoration:none;}&.selected{color:", ";border-color:", ";border-top-right-radius:", ";border-top-left-radius:", ";background-color:", ";}", ";"], get('fontSizes.1'), get('colors.fg.default'), getGlobalFocusStyles('-6px'), get('colors.fg.default'), get('colors.fg.default'), get('colors.border.default'), get('radii.2'), get('radii.2'), get('colors.canvas.default'), sx);
TabNavLink.displayName = 'TabNav.Link';
var TabNav$1 = Object.assign(TabNav, {
  Link: TabNavLink
});

export { TabNav$1 as default };
