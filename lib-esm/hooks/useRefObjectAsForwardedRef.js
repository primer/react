import { useImperativeHandle } from 'react';

/**
 * Use a ref object as the imperative handle for a forwarded ref. This can be used to
 * synchronize the ref object with the forwarded ref and allow local access the reference
 * instance with `.current`.
 *
 * **NOTE**: The `refObject` should be passed to the underlying element, NOT the `forwardedRef`.
 */

function useRefObjectAsForwardedRef(forwardedRef, refObject) {
  useImperativeHandle(forwardedRef, () => refObject.current);
}

export { useRefObjectAsForwardedRef };
