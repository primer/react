import type React from 'react'
import {useContext, useMemo, useEffect} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlags} from './FeatureFlagScope'

export type FeatureFlagsProps = React.PropsWithChildren<{
  flags: FeatureFlags
}>

// Global ref counter for data-dialog-scroll-optimized attribute
let dialogScrollOptimizedCount = 0

export function FeatureFlags({children, flags}: FeatureFlagsProps) {
  const parentFeatureFlags = useContext(FeatureFlagContext)
  const value = useMemo(() => {
    const scope = FeatureFlagScope.merge(parentFeatureFlags, FeatureFlagScope.create(flags))
    return scope
  }, [parentFeatureFlags, flags])

  const isOptimizationEnabled = value.enabled('primer_react_css_has_selector_perf')

  // Set body attribute for CSS :has() optimization when flag is enabled
  useEffect(() => {
    if (isOptimizationEnabled) {
      dialogScrollOptimizedCount++
      document.body.setAttribute('data-dialog-scroll-optimized', '')
      return () => {
        dialogScrollOptimizedCount--
        if (dialogScrollOptimizedCount === 0) {
          document.body.removeAttribute('data-dialog-scroll-optimized')
        }
      }
    }
  }, [isOptimizationEnabled])

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}
