'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

/**
 * There are certain situations where a ref might be set after the current render cycle for a
 * component has finished.  e.g. a forward ref from a conditionally rendered child component.
 * In these situations, we need to force a re-render, which is done here by the useState hook.
 * @type TRef The type of the RefObject which should be created.
 */

function useRenderForcingRef(value) {
  const [refCurrent, setRefCurrent] = React.useState(value || null);
  const ref = React.useRef(null);
  ref.current = refCurrent;
  const setRef = React.useCallback(newRef => {
    ref.current = newRef;
    setRefCurrent(newRef);
  }, [ref]);
  return [ref, setRef];
}

exports.useRenderForcingRef = useRenderForcingRef;
