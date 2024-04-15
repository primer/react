import React, {useContext, useMemo} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlags} from './FeatureFlagScope'

export type FeatureFlagsProps = React.PropsWithChildren<{
  flags: FeatureFlags
}>

export function FeatureFlags({children, flags}: FeatureFlagsProps) {
  const parentScope = useContext(FeatureFlagContext)
  const value = useMemo(() => {
    const scope = FeatureFlagScope.create(flags)
    return FeatureFlagScope.merge(parentScope, scope)
  }, [parentScope, flags])
  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}
