import React from 'react';
import { getAnchoredPosition } from '@primer/behaviors';
import { useProvidedRefOrCreate } from './useProvidedRefOrCreate.js';
import { useResizeObserver } from './useResizeObserver.js';
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect.js';

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
  const floatingElementRef = useProvidedRefOrCreate(settings === null || settings === void 0 ? void 0 : settings.floatingElementRef);
  const anchorElementRef = useProvidedRefOrCreate(settings === null || settings === void 0 ? void 0 : settings.anchorElementRef);
  const [position, setPosition] = React.useState(undefined);
  const updatePosition = React.useCallback(() => {
    if (floatingElementRef.current instanceof Element && anchorElementRef.current instanceof Element) {
      setPosition(getAnchoredPosition(floatingElementRef.current, anchorElementRef.current, settings));
    } else {
      setPosition(undefined);
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [floatingElementRef, anchorElementRef, ...dependencies]);
  useLayoutEffect(updatePosition, [updatePosition]);
  useResizeObserver(updatePosition);
  return {
    floatingElementRef,
    anchorElementRef,
    position
  };
}

export { useAnchoredPosition };
