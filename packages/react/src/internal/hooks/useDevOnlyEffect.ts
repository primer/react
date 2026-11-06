import {useEffect} from 'react'

/**
 * Runs an effect only in development. Selecting the implementation at module
 * initialization avoids conditional Hook calls and uses a no-op in production.
 *
 * `exhaustive-deps` is wired up to also check call sites of this hook via
 * `additionalEffectHooks` in `eslint.config.mjs`, so callers get the same
 * deps lint they would for a plain `useEffect`.
 *
 * @param effect The effect callback to run in development.
 * @param deps Dependency list, same semantics as `useEffect`.
 */
export const useDevOnlyEffect: typeof useEffect = __DEV__ ? useEffect : () => {}
