import {isMacOS as ssrUnsafeIsMacOS} from '@primer/behaviors/utils'
import {useEffect, useState} from 'react'

/**
 * SSR-safe hook for determining if the current platform is MacOS. When rendering
 * server-side, will default to non-MacOS and then re-render in an effect if the
 * client turns out to be a MacOS device.
 */
export function useIsMacOS() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [isMacOS, setIsMacOS] = useState(() => (window !== undefined ? ssrUnsafeIsMacOS() : false))

  useEffect(() => setIsMacOS(ssrUnsafeIsMacOS()), [])

  return isMacOS
}
