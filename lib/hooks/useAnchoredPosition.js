'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var behaviors = require('@primer/behaviors');
var useProvidedRefOrCreate = require('./useProvidedRefOrCreate.js');
var useResizeObserver = require('./useResizeObserver.js');
var useIsomorphicLayoutEffect = require('../utils/useIsomorphicLayoutEffect.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * Calculates the top and left values for an absolutely-positioned floating element
 * to be anchored to some anchor element. Returns refs for the floating element
 * and the anchor element, along with the position.
 * @param settings Settings for calculating the anchored position.
 * @param dependencies Dependencies to determine when to re-calculate the position.
 * @returns An object of {top: number, left: number} to absolutely-position the
 * floating element.
 */
function useAnchoredPosition(settings, dependencies = []) {
  const floatingElementRef = useProvidedRefOrCreate.useProvidedRefOrCreate(settings === null || settings === void 0 ? void 0 : settings.floatingElementRef);
  const anchorElementRef = useProvidedRefOrCreate.useProvidedRefOrCreate(settings === null || settings === void 0 ? void 0 : settings.anchorElementRef);
  const [position, setPosition] = React__default["default"].useState(undefined);
  const updatePosition = React__default["default"].useCallback(() => {
    if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
      setPosition(behaviors.getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, settings));
    } else {
      setPosition(undefined);
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [floatingElementRef, anchorElementRef, ...dependencies]);
  useIsomorphicLayoutEffect(updatePosition, [updatePosition]);
  useResizeObserver.useResizeObserver(updatePosition);
  return {
    floatingElementRef,
    anchorElementRef,
    position
  };
}

exports.useAnchoredPosition = useAnchoredPosition;
