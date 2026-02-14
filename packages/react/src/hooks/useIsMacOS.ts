import {isMacOS as ssrUnsafeIsMacOS} from '@primer/behaviors/utils'
import {useSyncExternalStore} from 'react'

// No-op. The platform never changes at runtime, so there is nothing to
// subscribe to. Hoisted to avoid creating a new function on every call.
const subscribe = () => () => {}

// Safe default for SSR since we can't detect the platform on the server.
const getServerSnapshot = () => false

/**
 * SSR-safe hook for determining if the current platform is MacOS.
 *
 * Uses `useSyncExternalStore` to read the platform value:
 *
 * - On the **client**, `ssrUnsafeIsMacOS` reads `navigator.userAgent` and
 *   returns the real value immediately, with no extra render pass.
 *
 * - On the **server**, returns `false`. During hydration, if the snapshots
 *   differ, React handles the mismatch internally in a single synchronous
 *   pass, avoiding the layout shift that a deferred `useEffect` + `setState`
 *   would cause.
 *
 * Previous implementation used `useState` + `useEffect`, which caused an
 * unconditional second render on every mount (even on the client where the
 * initial value was already correct).
 */
export function useIsMacOS() {
  return useSyncExternalStore(subscribe, ssrUnsafeIsMacOS, getServerSnapshot)
}
