'use strict';

var React = require('react');

/**
 * Safely call `setTimeout` and `clearTimeout` within a component.
 *
 * This hook ensures that all timeouts are cleared when the component unmounts.
 */
function useSafeTimeout() {
  const timers = React.useRef(new Set());
  const safeSetTimeout = React.useCallback((handler, timeout, ...args) => {
    const id = window.setTimeout(handler, timeout, ...args);
    timers.current.add(id);
    return id;
  }, []);
  const safeClearTimeout = React.useCallback(id => {
    clearTimeout(id);
    timers.current.delete(id);
  }, []);
  React.useEffect(() => {
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

module.exports = useSafeTimeout;
