import type {SelectPanelProps} from '../SelectPanel'

const positionProps = ['position', 'top', 'left', 'right', 'bottom'] as const

// Keep focus opt-outs, outside-click exceptions, and legacy positioning/reflow
// options on the compatibility host until their native parity is established.
// Ordinary DOM props, styles, refs, sizing, names, and dismissal overrides are
// forwarded by NativeSelectPanelOverlay rather than discarded.
export function supportsConfiguredNativeOverlay({
  overlayProps,
  height,
  cssAnchorPositioningSettings,
}: SelectPanelProps) {
  const style = overlayProps?.style
  return !(
    height === 'initial' ||
    overlayProps?.height === 'initial' ||
    overlayProps?.preventFocusOnOpen ||
    overlayProps?.preventFocusOnClose ||
    overlayProps?.ignoreClickRefs?.length ||
    overlayProps?.preventOverflow !== undefined ||
    overlayProps?.responsiveVariant !== undefined ||
    positionProps.some(key => overlayProps?.[key] !== undefined || style?.[key] !== undefined) ||
    (cssAnchorPositioningSettings?.fallbackStrategy !== undefined &&
      cssAnchorPositioningSettings.fallbackStrategy !== 'default')
  )
}
