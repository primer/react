'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var behaviors = require('@primer/behaviors');
var useProvidedRefOrCreate = require('./useProvidedRefOrCreate.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * Hook used to trap focus inside a container. Returns a ref that can be added to the container
 * that should trap focus.
 * @param settings {FocusTrapHookSettings}
 */
function useFocusTrap(settings, dependencies = []) {
  const containerRef = useProvidedRefOrCreate.useProvidedRefOrCreate(settings === null || settings === void 0 ? void 0 : settings.containerRef);
  const initialFocusRef = useProvidedRefOrCreate.useProvidedRefOrCreate(settings === null || settings === void 0 ? void 0 : settings.initialFocusRef);
  const disabled = settings === null || settings === void 0 ? void 0 : settings.disabled;
  const abortController = React__default["default"].useRef();
  const previousFocusedElement = React__default["default"].useRef(null); // If we are enabling a focus trap and haven't already stored the previously focused element
  // go ahead an do that so we can restore later when the trap is disabled.

  if (!previousFocusedElement.current && !(settings !== null && settings !== void 0 && settings.disabled)) {
    previousFocusedElement.current = document.activeElement;
  } // This function removes the event listeners that enable the focus trap and restores focus
  // to the previously-focused element (if necessary).


  function disableTrap() {
    var _abortController$curr;

    (_abortController$curr = abortController.current) === null || _abortController$curr === void 0 ? void 0 : _abortController$curr.abort();

    if (settings !== null && settings !== void 0 && settings.restoreFocusOnCleanUp && previousFocusedElement.current instanceof HTMLElement) {
      previousFocusedElement.current.focus();
      previousFocusedElement.current = null;
    }
  }

  React__default["default"].useEffect(() => {
    if (containerRef.current instanceof HTMLElement) {
      if (!disabled) {
        var _initialFocusRef$curr;

        abortController.current = behaviors.focusTrap(containerRef.current, (_initialFocusRef$curr = initialFocusRef.current) !== null && _initialFocusRef$curr !== void 0 ? _initialFocusRef$curr : undefined);
        return () => {
          disableTrap();
        };
      } else {
        disableTrap();
      }
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [containerRef, initialFocusRef, disabled, ...dependencies]);
  return {
    containerRef,
    initialFocusRef
  };
}

exports.useFocusTrap = useFocusTrap;
