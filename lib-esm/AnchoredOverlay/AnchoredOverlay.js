import React, { useCallback, useEffect } from 'react';
import Overlay from '../Overlay.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useFocusZone } from '../hooks/useFocusZone.js';
import { useSSRSafeId } from '@react-aria/ssr';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import { useRenderForcingRef } from '../hooks/useRenderForcingRef.js';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * An `AnchoredOverlay` provides an anchor that will open a floating overlay positioned relative to the anchor.
 * The overlay can be opened and navigated using keyboard or mouse.
 */
const AnchoredOverlay = ({
  renderAnchor,
  anchorRef: externalAnchorRef,
  anchorId: externalAnchorId,
  children,
  open,
  onOpen,
  onClose,
  height,
  width,
  overlayProps,
  focusTrapSettings,
  focusZoneSettings,
  side,
  align
}) => {
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef);
  const [overlayRef, updateOverlayRef] = useRenderForcingRef();
  const anchorId = useSSRSafeId(externalAnchorId);
  const onClickOutside = useCallback(() => onClose === null || onClose === void 0 ? void 0 : onClose('click-outside'), [onClose]);
  const onEscape = useCallback(() => onClose === null || onClose === void 0 ? void 0 : onClose('escape'), [onClose]);
  const onAnchorKeyDown = useCallback(event => {
    if (!event.defaultPrevented) {
      if (!open && ['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(event.key)) {
        onOpen === null || onOpen === void 0 ? void 0 : onOpen('anchor-key-press', event);
        event.preventDefault();
      }
    }
  }, [open, onOpen]);
  const onAnchorClick = useCallback(event => {
    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    if (!open) {
      onOpen === null || onOpen === void 0 ? void 0 : onOpen('anchor-click');
    } else {
      onClose === null || onClose === void 0 ? void 0 : onClose('anchor-click');
    }
  }, [open, onOpen, onClose]);
  const {
    position
  } = useAnchoredPosition({
    anchorElementRef: anchorRef,
    floatingElementRef: overlayRef,
    side,
    align
  }, [overlayRef.current]);
  useEffect(() => {
    // ensure overlay ref gets cleared when closed, so position can reset between closing/re-opening
    if (!open && overlayRef.current) {
      updateOverlayRef(null);
    }
  }, [open, overlayRef, updateOverlayRef]);
  useFocusZone({
    containerRef: overlayRef,
    disabled: !open || !position,
    ...focusZoneSettings
  });
  useFocusTrap({
    containerRef: overlayRef,
    disabled: !open || !position,
    ...focusTrapSettings
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderAnchor && renderAnchor({
    ref: anchorRef,
    id: anchorId,
    'aria-haspopup': 'true',
    'aria-expanded': open ? 'true' : undefined,
    tabIndex: 0,
    onClick: onAnchorClick,
    onKeyDown: onAnchorKeyDown
  }), open ? /*#__PURE__*/React.createElement(Overlay, _extends({
    returnFocusRef: anchorRef,
    onClickOutside: onClickOutside,
    ignoreClickRefs: [anchorRef],
    onEscape: onEscape,
    ref: updateOverlayRef,
    role: "none",
    visibility: position ? 'visible' : 'hidden',
    height: height,
    width: width,
    top: (position === null || position === void 0 ? void 0 : position.top) || 0,
    left: (position === null || position === void 0 ? void 0 : position.left) || 0,
    anchorSide: position === null || position === void 0 ? void 0 : position.anchorSide
  }, overlayProps), children) : null);
};
AnchoredOverlay.displayName = 'AnchoredOverlay';
AnchoredOverlay.defaultProps = {
  side: 'outside-bottom',
  align: 'start'
};

export { AnchoredOverlay };
