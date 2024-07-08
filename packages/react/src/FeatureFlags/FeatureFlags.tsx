import React, {useMemo, type PropsWithChildren} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlags} from './FeatureFlagScope'
import {DefaultFeatureFlags} from './DefaultFeatureFlags'

export type FeatureFlagsProps = PropsWithChildren<{
  /** Object where keys are feature flag names and values are boolean */
  flags: FeatureFlags
}>

/**
 * A helper component that uses context to let consumers check if a feature flag is enabled.
 * @primerid feature_flags
 * @primerstatus experimental
 * @primera11yreviewed false
 */
export function FeatureFlags({children, flags}: FeatureFlagsProps) {
  const value = useMemo(() => {
    const scope = FeatureFlagScope.merge(DefaultFeatureFlags, FeatureFlagScope.create(flags))
    return scope
  }, [flags])
  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}
