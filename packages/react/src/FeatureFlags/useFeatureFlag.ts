import {useContext} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'

/**
 * Check if the given feature flag is enabled
 */
export function useFeatureFlag(flag: string): boolean {
  const context = useContext(FeatureFlagContext)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return context?.enabled(flag) ?? false
}
