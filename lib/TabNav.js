'use strict';

var classnames = require('classnames');
var React = require('react');
var styled = require('styled-components');
var constants = require('./constants.js');
var useFocusZone = require('./hooks/useFocusZone.js');
var sx = require('./sx.js');
var _getGlobalFocusStyles = require('./_getGlobalFocusStyles.js');
var behaviors = require('@primer/behaviors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ITEM_CLASS = 'TabNav-item';
const SELECTED_CLASS = 'selected';
const TabNavBase = styled__default["default"].div.withConfig({
  displayName: "TabNav__TabNavBase",
  componentId: "sc-1ab407u-0"
})(["", ""], sx["default"]);
const TabNavTabList = styled__default["default"].div.withConfig({
  displayName: "TabNav__TabNavTabList",
  componentId: "sc-1ab407u-1"
})(["display:flex;margin-bottom:-1px;overflow:auto;"]);
const TabNavNav = styled__default["default"].nav.withConfig({
  displayName: "TabNav__TabNavNav",
  componentId: "sc-1ab407u-2"
})(["margin-top:0;border-bottom:1px solid ", ";"], constants.get('colors.border.default'));

function TabNav({
  children,
  'aria-label': ariaLabel,
  ...rest
}) {
  const customContainerRef = React.useRef(null);
  const customStrategy = React__default["default"].useCallback(() => {
    if (customContainerRef.current) {
      const tabs = Array.from(customContainerRef.current.querySelectorAll('[role=tab][aria-selected=true]'));
      return tabs[0];
    }
  }, [customContainerRef]);
  const {
    containerRef: navRef
  } = useFocusZone.useFocusZone({
    containerRef: customContainerRef,
    bindKeys: behaviors.FocusKeys.ArrowHorizontal | behaviors.FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap',
    focusInStrategy: customStrategy,
    focusableElementFilter: element => element.getAttribute('role') === 'tab'
  });
  return /*#__PURE__*/React__default["default"].createElement(TabNavBase, _extends({}, rest, {
    ref: navRef
  }), /*#__PURE__*/React__default["default"].createElement(TabNavNav, {
    "aria-label": ariaLabel
  }, /*#__PURE__*/React__default["default"].createElement(TabNavTabList, {
    role: "tablist"
  }, children)));
}

TabNav.displayName = "TabNav";
const TabNavLink = styled__default["default"].a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames__default["default"](ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
  role: 'tab',
  'aria-selected': !!props.selected,
  tabIndex: -1
})).withConfig({
  displayName: "TabNav__TabNavLink",
  componentId: "sc-1ab407u-3"
})(["padding:8px 12px;font-size:", ";line-height:20px;color:", ";text-decoration:none;background-color:transparent;border:1px solid transparent;border-bottom:0;", ";&:hover,&:focus{color:", ";text-decoration:none;}&.selected{color:", ";border-color:", ";border-top-right-radius:", ";border-top-left-radius:", ";background-color:", ";}", ";"], constants.get('fontSizes.1'), constants.get('colors.fg.default'), _getGlobalFocusStyles('-6px'), constants.get('colors.fg.default'), constants.get('colors.fg.default'), constants.get('colors.border.default'), constants.get('radii.2'), constants.get('radii.2'), constants.get('colors.canvas.default'), sx["default"]);
TabNavLink.displayName = 'TabNav.Link';
var TabNav$1 = Object.assign(TabNav, {
  Link: TabNavLink
});

module.exports = TabNav$1;
