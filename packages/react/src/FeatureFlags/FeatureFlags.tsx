import type React from 'react'
import {useContext, useMemo, useEffect} from 'react'
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

  // Set body attribute for CSS :has() optimization when flag is enabled
  useEffect(() => {
    if (flags.primer_react_css_has_selector_perf) {
      document.body.setAttribute('data-dialog-scroll-optimized', '')
      return () => {
        document.body.removeAttribute('data-dialog-scroll-optimized')
      }
    }
  }, [flags.primer_react_css_has_selector_perf])

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}
