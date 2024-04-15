import {useContext} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'

type FlagValue<Input extends ReadonlyArray<string>> = {
  [K in Input extends ReadonlyArray<infer U> ? U : never]: boolean
}

/**
 * Check if the given feature flag is enabled
 */
export function useFeatureFlags<T extends ReadonlyArray<string>>(flags: T): FlagValue<T> {
  const context = useContext(FeatureFlagContext)
  return Object.fromEntries(
    flags.map(flag => {
      return [flag, context.enabled(flag)]
    }),
  ) as FlagValue<T>
}
