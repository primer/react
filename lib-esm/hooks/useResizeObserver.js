import { useRef } from 'react';
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect.js';

function useResizeObserver(callback, target) {
  const savedCallback = useRef(callback);
  useLayoutEffect(() => {
    savedCallback.current = callback;
  });
  useLayoutEffect(() => {
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
