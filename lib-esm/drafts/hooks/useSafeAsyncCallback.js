import { useRef, useLayoutEffect, useEffect, useCallback } from 'react';

const callbackCancelledResult = Symbol('callbackCancelledResult');

/**
 * Making async callbacks within React components is risky and error-prone. It's easy to
 * accidentally call an outdated reference to the function, or to call it after the
 * component has unmounted.
 *
 * This hook solves these problems by returning a function that is referentially constant
 * (it can never be outdated) and will have no effect if called after unmounting. If the
 * callback is cancelled due to calling after unmounting, the returned value will be
 * the unique symbol `callbackCancelledResult`.
 *
 * This callback is safe to call after `await`ing a `Promise` (or in the `.then` clause of a
 * `Promise`) and in `setTimeout`.
 *
 * @param fn the function to call
 * @param allowCallingAfterUnmount If the component is unmounted, should this be called?
 * This should typically be `false` but may be desirable in cases where user's changes would
 * not get saved unless the call is made, so the call can be made in the background after
 * unmount. If this is `true`, it's very important not to set state in this callback!
 */
const useSafeAsyncCallback = (fn, allowCallingAfterUnmount = false) => {
  const trackingRef = useRef(fn);
  useLayoutEffect(() => {
    trackingRef.current = fn;
  }, [fn]);
  const isMountedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      if (!allowCallingAfterUnmount) isMountedRef.current = false;
    };
  }, [allowCallingAfterUnmount]);
  return useCallback((...args) => isMountedRef.current ? trackingRef.current(...args) : callbackCancelledResult, [] // this dependency array must always be empty
  );
};

export { callbackCancelledResult, useSafeAsyncCallback };
