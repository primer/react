'use client'

import React from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlagValues} from './FeatureFlagScope'

export interface FeatureFlagsProps {
  children?: React.ReactNode
  /** Flags to enable or disable for everything rendered inside, merged over any flags from an enclosing provider. */
  flags: FeatureFlagValues
}

export const FeatureFlags: React.FC<FeatureFlagsProps> = ({children, flags}) => {
  const parent = React.useContext(FeatureFlagContext)
  const scope = React.useMemo(() => FeatureFlagScope.merge(parent, FeatureFlagScope.create(flags)), [flags, parent])

  return <FeatureFlagContext.Provider value={scope}>{children}</FeatureFlagContext.Provider>
}
