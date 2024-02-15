import {useContext} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'

/**
 * Check if the given feature flag is enabled
 */
export function useFeatureFlag(flag: string): boolean {
  const context = useContext(FeatureFlagContext)
  if (context) {
    return context.enabled(flag)
  }
  return false
}
