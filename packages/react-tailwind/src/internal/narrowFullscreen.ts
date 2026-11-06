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
  'max-md:!fixed max-md:!inset-0 max-md:!transform-none max-md:flex max-md:flex-col max-md:bg-[var(--overlay-bgColor)] max-md:pb-[env(safe-area-inset-bottom)]'

/** Lets the popup fill the fullscreen positioner on narrow screens. */
export const narrowFullscreenPopupClassName =
  'max-md:!h-auto max-md:!min-h-0 max-md:flex-1 max-md:!w-full max-md:!max-w-none max-md:!max-h-none max-md:!rounded-none max-md:shadow-none'
