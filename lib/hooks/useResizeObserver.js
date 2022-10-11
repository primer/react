'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useIsomorphicLayoutEffect = require('../utils/useIsomorphicLayoutEffect.js');

function useResizeObserver(callback, target) {
  const savedCallback = React.useRef(callback);
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  });
  useIsomorphicLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : document.documentElement;

    if (!targetEl) {
      return;
    }

    const observer = new ResizeObserver(entries => {
      savedCallback.current(entries);
    });
    observer.observe(targetEl);
    return () => {
      observer.disconnect();
    };
  }, [target]);
}

exports.useResizeObserver = useResizeObserver;
