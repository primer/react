import {useEffect} from 'react'
import {useEffectCallback} from './useEffectCallback'

/**
 * Runs an effect only in development. Wrapping `useEffect` in a regular hook
 * with an outer `__DEV__` guard keeps the production cost low while centralising
 * the development-only effect behavior instead of repeating it at every call
 * site.
 *
 * `exhaustive-deps` is wired up to also check call sites of this hook via
 * `additionalEffectHooks` in `eslint.config.mjs`, so callers get the same
 * deps lint they would for a plain `useEffect`.
 *
 * @param effect The effect callback to run in development.
 * @param _deps Dependency list accepted for call-site compatibility.
 */
export const useDevOnlyEffect = (effect: React.EffectCallback, _deps?: React.DependencyList) => {
  const effectCallback = useEffectCallback(effect)

  useEffect(() => {
    if (__DEV__) {
      return effectCallback()
    }
  })
}
