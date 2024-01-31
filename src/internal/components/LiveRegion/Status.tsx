import React, {useRef} from 'react'
import {useLiveRegion} from './useLiveRegion'
import {useEffectOnce} from '../../hooks/useEffectOnce'
import type {AnnounceOptions} from './live-region-element'

type StatusProps = React.PropsWithChildren<Pick<AnnounceOptions, 'delayMs'> & React.ComponentPropsWithoutRef<'div'>>

/**
 * The `Status` component announces the text content of the `children` provided
 * using a live region using a 'polite' politeness setting. It is analagous to
 * the `status` role.
 */
export function Status({children, delayMs, ...rest}: StatusProps) {
  const liveRegion = useLiveRegion()
  const ref = useRef<HTMLDivElement>(null)

  useEffectOnce(() => {
    if (ref.current) {
      return liveRegion?.announceFromElement(ref.current, {
        delayMs,
        politeness: 'polite',
      })
    }
  })

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  )
}
