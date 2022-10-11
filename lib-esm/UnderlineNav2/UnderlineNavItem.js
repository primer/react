import React, { forwardRef, useRef, useContext, useLayoutEffect } from 'react';
import Box from '../Box.js';
import '../sx.js';
import { UnderlineNavContext } from './UnderlineNavContext.js';
import CounterLabel from '../CounterLabel.js';
import { getLinkStyles, wrapperStyles, iconWrapStyles, counterStyles } from './styles.js';
import { LoadingCounter } from './LoadingCounter.js';
import merge from 'deepmerge';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const UnderlineNavItem = /*#__PURE__*/forwardRef(({
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
  const backupRef = useRef(null);
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
  } = useContext(UnderlineNavContext);
  useLayoutEffect(() => {
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
  const keyPressHandler = React.useCallback(event => {
    if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
      if (typeof onSelect === 'function') onSelect(event);
      if (typeof afterSelect === 'function') afterSelect(event);
    }

    setSelectedLink(ref);
    event.preventDefault();
  }, [onSelect, afterSelect, ref, setSelectedLink]);
  const clickHandler = React.useCallback(event => {
    if (!event.defaultPrevented) {
      if (typeof onSelect === 'function') onSelect(event);
      if (typeof afterSelect === 'function') afterSelect(event);
    }

    setSelectedLink(ref);
    event.preventDefault();
  }, [onSelect, afterSelect, ref, setSelectedLink]);
  return /*#__PURE__*/React.createElement(Box, {
    as: "li",
    sx: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Box, _extends({
    as: Component,
    href: href,
    onKeyPress: keyPressHandler,
    onClick: clickHandler
  }, selectedLink === ref ? {
    'aria-current': 'page'
  } : {}, {
    sx: merge(getLinkStyles(theme, {
      variant
    }, selectedLink, ref), sxProp)
  }, props, {
    ref: ref,
    onFocus: () => setFocusedLink(ref)
  }), /*#__PURE__*/React.createElement(Box, {
    as: "div",
    "data-component": "wrapper",
    sx: wrapperStyles
  }, iconsVisible && Icon && /*#__PURE__*/React.createElement(Box, {
    as: "span",
    "data-component": "icon",
    sx: iconWrapStyles
  }, /*#__PURE__*/React.createElement(Icon, null)), children && /*#__PURE__*/React.createElement(Box, {
    as: "span",
    "data-component": "text",
    "data-content": children,
    sx: selectedLink === ref ? {
      fontWeight: 600
    } : {}
  }, children), counter && /*#__PURE__*/React.createElement(Box, {
    as: "span",
    "data-component": "counter",
    sx: counterStyles
  }, loadingCounters ? /*#__PURE__*/React.createElement(LoadingCounter, null) : /*#__PURE__*/React.createElement(CounterLabel, null, counter)))));
});

export { UnderlineNavItem };
