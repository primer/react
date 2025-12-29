import type React from 'react'
import {useContext, useMemo, useEffect, useRef} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlags} from './FeatureFlagScope'

export type FeatureFlagsProps = React.PropsWithChildren<{
  flags: FeatureFlags
}>

// WeakMap-based ref counting for data-dialog-scroll-optimized attribute
// Keys are component instances, values track if the instance has contributed to the count
const dialogScrollOptimizedInstances = new WeakMap<object, boolean>()
let dialogScrollOptimizedCount = 0

export function FeatureFlags({children, flags}: FeatureFlagsProps) {
  const parentFeatureFlags = useContext(FeatureFlagContext)
  const value = useMemo(() => {
    const scope = FeatureFlagScope.merge(parentFeatureFlags, FeatureFlagScope.create(flags))
    return scope
  }, [parentFeatureFlags, flags])

  const isOptimizationEnabled = value.enabled('primer_react_css_has_selector_perf')
  const instanceRef = useRef({})

  // Set body attribute for CSS :has() optimization when flag is enabled
  useEffect(() => {
    if (isOptimizationEnabled) {
      const instance = instanceRef.current
      if (!dialogScrollOptimizedInstances.get(instance)) {
        dialogScrollOptimizedInstances.set(instance, true)
        dialogScrollOptimizedCount++
        document.body.setAttribute('data-dialog-scroll-optimized', '')
      }
      return () => {
        if (dialogScrollOptimizedInstances.get(instance)) {
          dialogScrollOptimizedInstances.delete(instance)
          dialogScrollOptimizedCount--
          if (dialogScrollOptimizedCount === 0) {
            document.body.removeAttribute('data-dialog-scroll-optimized')
          }
        }
      }
    }
  }, [isOptimizationEnabled])

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}
