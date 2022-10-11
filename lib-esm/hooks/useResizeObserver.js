import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect.js';

function useResizeObserver(callback, target) {
  const savedCallback = useRef(callback);
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

export { useResizeObserver };
