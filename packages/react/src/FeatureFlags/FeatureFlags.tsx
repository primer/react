import type React from 'react'
import {useContext, useMemo} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlags} from './FeatureFlagScope'

export type FeatureFlagsProps = React.PropsWithChildren<{
  flags: FeatureFlags
}>

export function FeatureFlags({children, flags}: FeatureFlagsProps) {
  const parentFeatureFlags = useContext(FeatureFlagContext)
  const value = useMemo(() => {
    const scope = FeatureFlagScope.merge(parentFeatureFlags, FeatureFlagScope.create(flags))
    return scope
  }, [parentFeatureFlags, flags])
  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}
