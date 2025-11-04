import {isMacOS as ssrUnsafeIsMacOS} from '@primer/behaviors/utils'
import {useEffect, useState} from 'react'
import {canUseDOM} from '../utils/environment'

/**
 * SSR-safe hook for determining if the current platform is MacOS. When rendering
 * server-side, will default to non-MacOS and then re-render in an effect if the
 * client turns out to be a MacOS device.
 */
export function useIsMacOS() {
  const [isMacOS, setIsMacOS] = useState(() => (canUseDOM ? ssrUnsafeIsMacOS() : false))

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMacOS(ssrUnsafeIsMacOS())
  }, [])

  return isMacOS
}
