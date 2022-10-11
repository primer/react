import React, { useContext, useCallback } from 'react';
import Overlay from '../Overlay.js';
import { AutocompleteContext } from './AutocompleteContext.js';
import { useRefObjectAsForwardedRef } from '../hooks/useRefObjectAsForwardedRef.js';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// TODO: consider making 'aria-labelledby' required
function AutocompleteOverlay({
  menuAnchorRef,
  overlayProps: oldOverlayProps,
  children,
  ...newOverlayProps
}) {
  const autocompleteContext = useContext(AutocompleteContext);

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
  } = useAnchoredPosition({
    side: 'outside-bottom',
    align: 'start',
    anchorElementRef: menuAnchorRef ? menuAnchorRef : inputRef
  }, [showMenu, selectedItemLength]);
  useRefObjectAsForwardedRef(scrollContainerRef, floatingElementRef);
  const closeOptionList = useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  if (typeof window === 'undefined') {
    return null;
  }

  return /*#__PURE__*/React.createElement(Overlay, _extends({
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

export { AutocompleteOverlay as default };
