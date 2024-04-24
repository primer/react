import React, {useMemo} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlags} from './FeatureFlagScope'
import {DefaultFeatureFlags} from './DefaultFeatureFlags'

export type FeatureFlagsProps = React.PropsWithChildren<{
  flags: FeatureFlags
}>

export function FeatureFlags({children, flags}: FeatureFlagsProps) {
  const value = useMemo(() => {
    const scope = FeatureFlagScope.merge(DefaultFeatureFlags, FeatureFlagScope.create(flags))
    return scope
  }, [flags])
  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}
