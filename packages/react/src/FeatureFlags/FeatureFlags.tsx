import type React from 'react'
import {useContext, useMemo, useEffect} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'
import {FeatureFlagScope, type FeatureFlags} from './FeatureFlagScope'

export type FeatureFlagsProps = React.PropsWithChildren<{
  flags: FeatureFlags
}>

/**
 * Ref count for data-dialog-scroll-optimized attribute management.
 *
 * NOTE: This is temporary infrastructure while we feature flag the CSS :has()
 * performance optimization (primer_react_css_has_selector_perf). Once the flag
 * is removed and the optimization is the default behavior, this ref counting
 * can be removed - the attribute can simply always be present.
 *
 * @internal - Not part of the public API
 */
let dialogScrollOptimizedCount = 0

/**
 * Reset the ref count for testing purposes only.
 *
 * @internal - Not part of the public API. Only exported for test isolation.
 */
export function __resetDialogScrollOptimizedCount(): void {
  dialogScrollOptimizedCount = 0
  document.body.removeAttribute('data-dialog-scroll-optimized')
}

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
