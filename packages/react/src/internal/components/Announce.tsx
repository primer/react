import {announceFromElement} from '@primer/live-region-element'
import React, {useEffect, useRef, type ElementRef} from 'react'
import Box from '../../Box'
import {useEffectOnce} from '../hooks/useEffectOnce'

export type AnnounceProps = React.ComponentPropsWithoutRef<typeof Box> & {
  /**
   * The politeness level to use for the announcement
   * @default polite
   */
  politeness?: 'polite' | 'assertive'
}

/**
 * `Announce` is a component that will announce the text content of the
 * `children` passed in to screen readers using the given politeness level. It
 * will also announce any changes to the text content of `children`
 */
export function Announce({children, politeness = 'polite', ...rest}: AnnounceProps) {
  const ref = useRef<ElementRef<'div'>>(null)
  const savedPoliteness = useRef(politeness)

  useEffect(() => {
    savedPoliteness.current = politeness
  }, [politeness])

  // Announce the initial message, this is wrapped in `useEffectOnce` so that it
  // does not announce twice in StrictMode
  useEffectOnce(() => {
    if (ref.current !== null) {
      announceFromElement(ref.current, {
        politeness: savedPoliteness.current,
      })
    }
  })

  useEffect(() => {
    if (ref.current === null) {
      return
    }

    const {current: container} = ref

    // When the text of the container changes, announce the new text
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === 'characterData') {
          announceFromElement(container, {
            politeness: savedPoliteness.current,
          })
          break
        }
      }
    })

    observer.observe(container, {
      subtree: true,
      characterData: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Box {...rest} ref={ref}>
      {children}
    </Box>
  )
}
