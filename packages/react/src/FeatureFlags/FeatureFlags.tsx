import React, {useMemo} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlags} from './FeatureFlagScope'
import {GlobalFeatureFlags} from './GlobalFeatureFlags'

export type FeatureFlagsProps = React.PropsWithChildren<{
  flags: FeatureFlags
}>

export function FeatureFlags({children, flags}: FeatureFlagsProps) {
  const value = useMemo(() => {
    const scope = FeatureFlagScope.merge(GlobalFeatureFlags, FeatureFlagScope.create(flags))
    return scope
  }, [flags])
  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}
