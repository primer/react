import React, {useRef} from 'react'
import {useLiveRegion} from './useLiveRegion'
import {useEffectOnce} from '../../hooks/useEffectOnce'
import type {AnnounceOptions} from './live-region-element'

type AlertProps = React.PropsWithChildren<Pick<AnnounceOptions, 'delayMs'> & React.ComponentPropsWithoutRef<'div'>>

/**
 * The `Alert` component announces the text content of the `children` provided
 * using a live region with an 'assertive' politeness setting. It is analagous
 * to the `alert` role.
 */
export function Alert({children, delayMs, ...rest}: AlertProps) {
  const liveRegion = useLiveRegion()
  const ref = useRef<HTMLDivElement>(null)

  useEffectOnce(() => {
    if (ref.current) {
      return liveRegion?.announceFromElement(ref.current, {
        delayMs,
        politeness: 'assertive',
      })
    }
  })

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  )
}
