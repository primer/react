import {isMacOS as ssrUnsafeIsMacOS} from '@primer/behaviors/utils'
import {useSyncExternalStore} from 'react'

// No-op subscribe function. Hoisted to module scope to avoid creating a new
// function on every call. The platform never changes at runtime, so there is
// nothing to subscribe to.
const noop = () => () => {}

/**
 * SSR-safe hook for determining if the current platform is MacOS.
 *
 * Uses `useSyncExternalStore` to read the platform value:
 *
 * - On the **server**, `getServerSnapshot` returns `false` (safe default since
 *   we can't detect the platform during SSR).
 *
 * - On the **client**, `getSnapshot` calls `ssrUnsafeIsMacOS()` which reads
 *   `navigator.userAgent` and returns the real value immediately, with no
 *   extra render pass.
 *
 * - During **hydration**, if the server snapshot (`false`) differs from the
 *   client snapshot (`true` on a Mac), React handles the mismatch internally
 *   and commits the client value in a single synchronous pass, avoiding the
 *   layout shift that a deferred `useEffect` + `setState` would cause.
 *
 * The `subscribe` argument is a no-op because the platform is a static value
 * that never changes. This tells React the snapshot is stable, so it never
 * needs to re-check or re-render for this value after the initial mount.
 *
 * Previous implementation used `useState` + `useEffect`, which caused an
 * unconditional second render on every mount (even on the client where the
 * initial value was already correct). This affected Tooltip, KeybindingHint,
 * and TreeView.
 */
export function useIsMacOS() {
  return useSyncExternalStore(noop, ssrUnsafeIsMacOS, () => false)
}
