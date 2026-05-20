import {useEffect, useState} from 'react'
import type React from 'react'
import {useFeatureFlag} from '../FeatureFlags'
import {useId} from './useId'

export interface CSSAnchorPositioningSettings {
  /**
   * Ref to the anchor element that the overlay is positioned relative to.
   */
  anchorElementRef: React.RefObject<HTMLElement | null>
  /**
   * Ref to the floating/overlay element that will be positioned.
   */
  floatingElementRef: React.RefObject<Element | null>
  /**
   * Whether the overlay is currently open/visible. When false, only the
   * anchor-name is applied (without position-anchor on the overlay).
   */
  open?: boolean
}

export interface CSSAnchorPositioningResult {
  /**
   * Whether CSS anchor positioning is active (feature flag enabled (temporary) + browser support).
   * Use this to conditionally skip JS-based positioning and apply CSS classes.
   */
  enabled: boolean
}

/**
 * Manages CSS anchor positioning by linking an anchor element and a floating
 * element via `anchor-name` and `position-anchor` CSS properties.
 *
 * 1. Checks the `primer_react_css_anchor_positioning` feature flag
 * 2. Detects native browser support for CSS anchor positioning
 * 3. Sets `anchor-name` on the anchor element
 * 4. Sets `position-anchor` on the floating element when open
 * 5. Cleans up styles on unmount or when closed
 */
export function useCSSAnchorPositioning(settings: CSSAnchorPositioningSettings): CSSAnchorPositioningResult {
  const {anchorElementRef, floatingElementRef, open = true} = settings

  // Temporary state to track support for CSS anchor positioning, will be removed once the feature is shipped.
  const cssAnchorPositioningFlag = useFeatureFlag('primer_react_css_anchor_positioning')
  const [supportsNativeCSSAnchorPositioning] = useState(
    () => typeof document !== 'undefined' && 'anchorName' in document.documentElement.style,
  )

  const enabled = cssAnchorPositioningFlag && supportsNativeCSSAnchorPositioning

  const rawId = useId()
  const id = rawId.replaceAll(':', '_')
  const anchorName = `--css-anchor-${id}`

  useEffect(() => {
    if (!enabled) return

    const anchorElement = anchorElementRef.current
    const floatingElement = floatingElementRef.current as HTMLElement | null

    if (!anchorElement) return

    anchorElement.style.setProperty('anchor-name', anchorName)

    if (open && floatingElement) {
      floatingElement.style.setProperty('position-anchor', anchorName)
    }

    return () => {
      anchorElement.style.removeProperty('anchor-name')
      if (floatingElement) {
        floatingElement.style.removeProperty('position-anchor')
      }
    }
  }, [enabled, open, anchorName, anchorElementRef, floatingElementRef])

  return {enabled}
}
