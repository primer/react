import type {AnchoredOverlayVariant} from '../utils/types'

/** Whether anchored content covers the viewport on narrow screens. */
export function isNarrowFullscreen(variant: AnchoredOverlayVariant | undefined): boolean {
  return typeof variant === 'object' && variant.narrow === 'fullscreen'
}

/**
 * Below the narrow breakpoint the positioner covers the viewport. The overrides are important because Base UI writes
 * the anchored position inline.
 */
export const narrowFullscreenPositionerClassName =
  'primer:max-md:!fixed primer:max-md:!inset-0 primer:max-md:!transform-none primer:max-md:flex primer:max-md:flex-col primer:max-md:bg-[var(--overlay-bgColor)] primer:max-md:pb-[env(safe-area-inset-bottom)]'

/** Lets the popup fill the fullscreen positioner on narrow screens. */
export const narrowFullscreenPopupClassName =
  'primer:max-md:!h-auto primer:max-md:!min-h-0 primer:max-md:flex-1 primer:max-md:!w-full primer:max-md:!max-w-none primer:max-md:!max-h-none primer:max-md:!rounded-none primer:max-md:shadow-none'
