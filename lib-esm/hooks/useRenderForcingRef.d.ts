import { RefObject } from 'react';
/**
 * There are certain situations where a ref might be set after the current render cycle for a
 * component has finished.  e.g. a forward ref from a conditionally rendered child component.
 * In these situations, we need to force a re-render, which is done here by the useState hook.
 * @type TRef The type of the RefObject which should be created.
 */
export declare function useRenderForcingRef<TRef>(value?: TRef): readonly [RefObject<TRef>, (newRef: TRef | null) => void];
