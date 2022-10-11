'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var useOnOutsideClick = require('./useOnOutsideClick.js');
var useOpenAndCloseFocus = require('./useOpenAndCloseFocus.js');
var useOnEscapePress = require('./useOnEscapePress.js');
var useProvidedRefOrCreate = require('./useProvidedRefOrCreate.js');

const useOverlay = ({
  overlayRef: _overlayRef,
  returnFocusRef,
  initialFocusRef,
  onEscape,
  ignoreClickRefs,
  onClickOutside,
  preventFocusOnOpen
}) => {
  const overlayRef = useProvidedRefOrCreate.useProvidedRefOrCreate(_overlayRef);
  useOpenAndCloseFocus.useOpenAndCloseFocus({
    containerRef: overlayRef,
    returnFocusRef,
    initialFocusRef,
    preventFocusOnOpen
  });
  useOnOutsideClick.useOnOutsideClick({
    containerRef: overlayRef,
    ignoreClickRefs,
    onClickOutside
  }); // We only want one overlay to close at a time

  const preventeddefaultCheckedEscape = event => {
    onEscape(event);
    event.preventDefault();
  };

  useOnEscapePress.useOnEscapePress(preventeddefaultCheckedEscape);
  return {
    ref: overlayRef
  };
};

exports.useOverlay = useOverlay;
