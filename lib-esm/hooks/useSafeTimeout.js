import { useRef, useCallback, useEffect } from 'react';

/**
 * Safely call `setTimeout` and `clearTimeout` within a component.
 *
 * This hook ensures that all timeouts are cleared when the component unmounts.
 */
function useSafeTimeout() {
  const timers = useRef(new Set());
  const safeSetTimeout = useCallback((handler, timeout, ...args) => {
    const id = window.setTimeout(handler, timeout, ...args);
    timers.current.add(id);
    return id;
  }, []);
  const safeClearTimeout = useCallback(id => {
    clearTimeout(id);
    timers.current.delete(id);
  }, []);
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      for (const id of timers.current) {
        clearTimeout(id);
      }
    };
  }, []);
  return {
    safeSetTimeout,
    safeClearTimeout
  };
}

export { useSafeTimeout as default };
