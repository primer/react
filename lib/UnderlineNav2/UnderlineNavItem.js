'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Box = require('../Box.js');
require('@styled-system/css');
var merge = require('deepmerge');
var UnderlineNavContext = require('./UnderlineNavContext.js');
var CounterLabel = require('../CounterLabel.js');
var styles = require('./styles.js');
var LoadingCounter = require('./LoadingCounter.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const UnderlineNavItem = /*#__PURE__*/React.forwardRef(({
  sx: sxProp = {},
  as: Component = 'a',
  href = '#',
  children,
  counter,
  onSelect,
  selected: preSelected = false,
  icon: Icon,
  ...props
}, forwardedRef) => {
  const backupRef = React.useRef(null);
  const ref = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : backupRef;
  const {
    theme,
    setChildrenWidth,
    setNoIconChildrenWidth,
    selectedLink,
    setSelectedLink,
    selectedLinkText,
    setSelectedLinkText,
    setFocusedLink,
    selectEvent,
    afterSelect,
    variant,
    loadingCounters,
    iconsVisible
  } = React.useContext(UnderlineNavContext.UnderlineNavContext);
  React.useLayoutEffect(() => {
    const domRect = ref.current.getBoundingClientRect();
    const icon = Array.from(ref.current.children[0].children).find(child => child.getAttribute('data-component') === 'icon');
    const content = Array.from(ref.current.children[0].children).find(child => child.getAttribute('data-component') === 'text');
    const text = content.textContent;
    const iconWidthWithMargin = icon ? icon.getBoundingClientRect().width + Number(getComputedStyle(icon).marginRight.slice(0, -2)) + Number(getComputedStyle(icon).marginLeft.slice(0, -2)) : 0;
    setChildrenWidth({
      text,
      width: domRect.width
    });
    setNoIconChildrenWidth({
      text,
      width: domRect.width - iconWidthWithMargin
    });
    preSelected && selectedLink === undefined && setSelectedLink(ref); // Only runs when a menu item is selected (swapping the menu item with the list item to keep it visible)

    if (selectedLinkText === text) {
      setSelectedLink(ref);
      if (typeof onSelect === 'function' && selectEvent !== null) onSelect(selectEvent);
      setSelectedLinkText('');
    }
  }, [ref, preSelected, selectedLink, selectedLinkText, setSelectedLinkText, setSelectedLink, setChildrenWidth, setNoIconChildrenWidth, onSelect, selectEvent]);
  const keyPressHandler = React__default["default"].useCallback(event => {
    if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
      if (typeof onSelect === 'function') onSelect(event);
      if (typeof afterSelect === 'function') afterSelect(event);
    }

    setSelectedLink(ref);
    event.preventDefault();
  }, [onSelect, afterSelect, ref, setSelectedLink]);
  const clickHandler = React__default["default"].useCallback(event => {
    if (!event.defaultPrevented) {
      if (typeof onSelect === 'function') onSelect(event);
      if (typeof afterSelect === 'function') afterSelect(event);
    }

    setSelectedLink(ref);
    event.preventDefault();
  }, [onSelect, afterSelect, ref, setSelectedLink]);
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "li",
    sx: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React__default["default"].createElement(Box, _extends({
    as: Component,
    href: href,
    onKeyPress: keyPressHandler,
    onClick: clickHandler
  }, selectedLink === ref ? {
    'aria-current': 'page'
  } : {}, {
    sx: merge__default["default"](styles.getLinkStyles(theme, {
      variant
    }, selectedLink, ref), sxProp)
  }, props, {
    ref: ref,
    onFocus: () => setFocusedLink(ref)
  }), /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "div",
    "data-component": "wrapper",
    sx: styles.wrapperStyles
  }, iconsVisible && Icon && /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    "data-component": "icon",
    sx: styles.iconWrapStyles
  }, /*#__PURE__*/React__default["default"].createElement(Icon, null)), children && /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    "data-component": "text",
    "data-content": children,
    sx: selectedLink === ref ? {
      fontWeight: 600
    } : {}
  }, children), counter && /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "span",
    "data-component": "counter",
    sx: styles.counterStyles
  }, loadingCounters ? /*#__PURE__*/React__default["default"].createElement(LoadingCounter.LoadingCounter, null) : /*#__PURE__*/React__default["default"].createElement(CounterLabel, null, counter)))));
});

exports.UnderlineNavItem = UnderlineNavItem;
