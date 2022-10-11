import { useOnOutsideClick } from './useOnOutsideClick.js';
import { useOpenAndCloseFocus } from './useOpenAndCloseFocus.js';
import { useOnEscapePress } from './useOnEscapePress.js';
import { useProvidedRefOrCreate } from './useProvidedRefOrCreate.js';

const useOverlay = ({
  overlayRef: _overlayRef,
  returnFocusRef,
  initialFocusRef,
  onEscape,
  ignoreClickRefs,
  onClickOutside,
  preventFocusOnOpen
}) => {
  const overlayRef = useProvidedRefOrCreate(_overlayRef);
  useOpenAndCloseFocus({
    containerRef: overlayRef,
    returnFocusRef,
    initialFocusRef,
    preventFocusOnOpen
  });
  useOnOutsideClick({
    containerRef: overlayRef,
    ignoreClickRefs,
    onClickOutside
  }); // We only want one overlay to close at a time

  const preventeddefaultCheckedEscape = event => {
    onEscape(event);
    event.preventDefault();
  };

  useOnEscapePress(preventeddefaultCheckedEscape);
  return {
    ref: overlayRef
  };
};

export { useOverlay };
