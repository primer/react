'use strict';

var React = require('react');
var Overlay = require('../Overlay.js');
var AutocompleteContext = require('./AutocompleteContext.js');
var useRefObjectAsForwardedRef = require('../hooks/useRefObjectAsForwardedRef.js');
var useAnchoredPosition = require('../hooks/useAnchoredPosition.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// TODO: consider making 'aria-labelledby' required
function AutocompleteOverlay({
  menuAnchorRef,
  overlayProps: oldOverlayProps,
  children,
  ...newOverlayProps
}) {
  const autocompleteContext = React.useContext(AutocompleteContext.AutocompleteContext);

  if (autocompleteContext === null) {
    throw new Error('AutocompleteContext returned null values');
  }

  const overlayProps = { ...oldOverlayProps,
    ...newOverlayProps
  };
  const {
    inputRef,
    scrollContainerRef,
    selectedItemLength,
    setShowMenu,
    showMenu = false
  } = autocompleteContext;
  const {
    floatingElementRef,
    position
  } = useAnchoredPosition.useAnchoredPosition({
    side: 'outside-bottom',
    align: 'start',
    anchorElementRef: menuAnchorRef ? menuAnchorRef : inputRef
  }, [showMenu, selectedItemLength]);
  useRefObjectAsForwardedRef.useRefObjectAsForwardedRef(scrollContainerRef, floatingElementRef);
  const closeOptionList = React.useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  if (typeof window === 'undefined') {
    return null;
  }

  return /*#__PURE__*/React__default["default"].createElement(Overlay, _extends({
    returnFocusRef: inputRef,
    preventFocusOnOpen: true,
    onClickOutside: closeOptionList,
    onEscape: closeOptionList,
    ref: floatingElementRef,
    top: position === null || position === void 0 ? void 0 : position.top,
    left: position === null || position === void 0 ? void 0 : position.left,
    visibility: showMenu ? 'visible' : 'hidden',
    sx: {
      overflow: 'auto'
    }
  }, overlayProps), children);
}

AutocompleteOverlay.displayName = "AutocompleteOverlay";
AutocompleteOverlay.displayName = 'AutocompleteOverlay';

module.exports = AutocompleteOverlay;
