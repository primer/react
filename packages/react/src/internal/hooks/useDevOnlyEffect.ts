import {useEffect} from 'react'

/**
 * Runs an effect only in development. Wrapping `useEffect` in a regular hook
 * with an outer `__DEV__` guard keeps the production cost to zero (the entire
 * call is dropped by the consumer's `process.env.NODE_ENV` replacement) while
 * centralising the `eslint-disable react-hooks/rules-of-hooks` to one place
 * instead of every call site.
 *
 * `exhaustive-deps` is wired up to also check call sites of this hook via
 * `additionalEffectHooks` in `eslint.config.mjs`, so callers get the same
 * deps lint they would for a plain `useEffect`.
 *
 * @param effect The effect callback to run in development.
 * @param deps Dependency list, same semantics as `useEffect`.
 */
export const useDevOnlyEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  if (__DEV__) {
    // Forwarding wrapper; deps lint applies at call sites.
    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
    useEffect(effect, deps)
  }
}
