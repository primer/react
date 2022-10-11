import React, { useEffect } from 'react';
import { focusZone } from '@primer/behaviors';
export { FocusKeys } from '@primer/behaviors';
import { useProvidedRefOrCreate } from './useProvidedRefOrCreate.js';

function useFocusZone(settings = {}, dependencies = []) {
  const containerRef = useProvidedRefOrCreate(settings.containerRef);
  const useActiveDescendant = !!settings.activeDescendantFocus;
  const passedActiveDescendantRef = typeof settings.activeDescendantFocus === 'boolean' || !settings.activeDescendantFocus ? undefined : settings.activeDescendantFocus;
  const activeDescendantControlRef = useProvidedRefOrCreate(passedActiveDescendantRef);
  const disabled = settings.disabled;
  const abortController = React.useRef();
  useEffect(() => {
    if (containerRef.current instanceof HTMLElement && (!useActiveDescendant || activeDescendantControlRef.current instanceof HTMLElement)) {
      if (!disabled) {
        var _activeDescendantCont;

        const vanillaSettings = { ...settings,
          activeDescendantControl: (_activeDescendantCont = activeDescendantControlRef.current) !== null && _activeDescendantCont !== void 0 ? _activeDescendantCont : undefined
        };
        abortController.current = focusZone(containerRef.current, vanillaSettings);
        return () => {
          var _abortController$curr;

          (_abortController$curr = abortController.current) === null || _abortController$curr === void 0 ? void 0 : _abortController$curr.abort();
        };
      } else {
        var _abortController$curr2;

        (_abortController$curr2 = abortController.current) === null || _abortController$curr2 === void 0 ? void 0 : _abortController$curr2.abort();
      }
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [disabled, ...dependencies]);
  return {
    containerRef,
    activeDescendantControlRef
  };
}

export { useFocusZone };
