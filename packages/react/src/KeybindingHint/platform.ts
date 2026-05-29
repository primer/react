import {isMacOS as ssrUnsafeIsMacOS} from '@primer/behaviors/utils'
import {useSyncExternalStore} from 'react'

/**
 * The platform categories that affect how keyboard shortcut keys are displayed.
 *
 * - `mac`: Apple platforms (macOS and iOS/iPadOS), which use the Command and Option keys.
 * - `windows`: Windows, which uses the Windows (Meta) key.
 * - `other`: Any other platform (e.g. Linux, Android), where the Meta key does not map to a
 *   consistent label.
 */
export type Platform = 'mac' | 'windows' | 'other'

// No-op. The platform never changes at runtime, so there is nothing to
// subscribe to. Hoisted to avoid creating a new function on every call.
const subscribe = () => () => {}

/** SSR-unsafe detection of iOS/iPadOS (in addition to macOS, which is detected separately). */
const ssrUnsafeIsIOS = () => {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.platform) || /iphone|ipad|ipod/i.test(navigator.userAgent)
}

/** SSR-unsafe detection of Windows. */
const ssrUnsafeIsWindows = () => {
  if (typeof navigator === 'undefined') return false
  return /^win/i.test(navigator.platform)
}

const getSnapshot = (): Platform => {
  if (ssrUnsafeIsMacOS() || ssrUnsafeIsIOS()) return 'mac'
  if (ssrUnsafeIsWindows()) return 'windows'
  return 'other'
}

// Safe default for SSR since we can't detect the platform on the server.
const getServerSnapshot = (): Platform => 'other'

/**
 * SSR-safe hook for determining the current platform category used when displaying
 * keyboard shortcut keys.
 *
 * Mirrors the approach of `useIsMacOS`: on the client it reads the real value immediately,
 * and on the server it returns a safe default (`'other'`).
 */
export function usePlatform(): Platform {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
