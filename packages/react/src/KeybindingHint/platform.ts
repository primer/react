import {isMacOS as ssrUnsafeIsMacOS} from '@primer/behaviors/utils'
import {createContext, useContext, useSyncExternalStore} from 'react'

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
 * Allows overriding the detected platform. This is primarily intended for testing and
 * Storybook, where we want to preview how keyboard hints render on platforms other than the
 * one actually running. A `null` value (the default) means "use the detected platform".
 */
const PlatformOverrideContext = createContext<Platform | null>(null)

export const PlatformOverrideProvider = PlatformOverrideContext.Provider

/**
 * SSR-safe hook for determining the current platform category used when displaying
 * keyboard shortcut keys.
 *
 * Mirrors the approach of `useIsMacOS`: on the client it reads the real value immediately,
 * and on the server it returns a safe default (`'other'`).
 *
 * If a `PlatformOverrideProvider` is present with a non-null value, that value is used
 * instead of the detected platform.
 */
export function usePlatform(): Platform {
  const override = useContext(PlatformOverrideContext)
  const detected = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return override ?? detected
}
