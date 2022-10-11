import { useEffect } from 'react';
import { iterateFocusableElements } from '@primer/behaviors/utils';

function useOpenAndCloseFocus({
  initialFocusRef,
  returnFocusRef,
  containerRef,
  preventFocusOnOpen
}) {
  useEffect(() => {
    if (preventFocusOnOpen) {
      return;
    }

    const returnRef = returnFocusRef.current;

    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus();
    } else if (containerRef.current) {
      const firstItem = iterateFocusableElements(containerRef.current).next().value;
      firstItem === null || firstItem === void 0 ? void 0 : firstItem.focus();
    }

    return function () {
      returnRef === null || returnRef === void 0 ? void 0 : returnRef.focus();
    };
  }, [initialFocusRef, returnFocusRef, containerRef, preventFocusOnOpen]);
}

export { useOpenAndCloseFocus };
