import { useLayoutEffect as useLayoutEffect$1, useEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? useLayoutEffect$1 : useEffect;
var useLayoutEffect = useIsomorphicLayoutEffect;

export { useLayoutEffect as default };
