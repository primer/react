import {announceFromElement} from '@primer/live-region-element'
import React, {useEffect, useRef, type ElementRef} from 'react'
import Box from '../../Box'
import {useEffectOnce} from '../hooks/useEffectOnce'

export type AnnounceProps = React.ComponentPropsWithoutRef<typeof Box> & {
  delayMs?: number

  /**
   * The politeness level to use for the announcement
   * @default polite
   */
  politeness?: 'polite' | 'assertive'

  skipFirstAnnouncement?: boolean
}

/**
 * `Announce` is a component that will announce the text content of the
 * `children` passed in to screen readers using the given politeness level. It
 * will also announce any changes to the text content of `children`
 */
export function Announce({
  children,
  delayMs,
  politeness = 'polite',
  skipFirstAnnouncement = false,
  ...rest
}: AnnounceProps) {
  const ref = useRef<ElementRef<'div'>>(null)
  const savedPoliteness = useRef(politeness)
  const savedDelayMs = useRef(delayMs)
  const savedCancel = useRef<(() => void) | null>(null)

  useEffect(() => {
    savedPoliteness.current = politeness
  }, [politeness])

  useEffect(() => {
    savedDelayMs.current = delayMs
  }, [delayMs])

  // Announce the initial message, this is wrapped in `useEffectOnce` so that it
  // does not announce twice in StrictMode
  useEffectOnce(() => {
    const {current: container} = ref
    if (container === null) {
      return
    }

    if (!skipFirstAnnouncement) {
      savedCancel.current = announceFromElement(container, {
        delayMs: savedDelayMs.current,
        politeness: savedPoliteness.current,
        from: container,
      })
    }
  })

  useEffect(() => {
    const {current: container} = ref
    if (container === null) {
      return
    }

    // When the text of the container changes, announce the new text
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === 'characterData') {
          if (savedCancel.current !== null) {
            savedCancel.current()
          }

          savedCancel.current = announceFromElement(container, {
            delayMs: savedDelayMs.current,
            politeness: savedPoliteness.current,
            from: container,
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

  useEffect(() => {
    return () => {
      if (savedCancel.current !== null) {
        savedCancel.current()
        savedCancel.current = null
      }
    }
  }, [])

  return (
    <Box {...rest} ref={ref}>
      {children}
    </Box>
  )
}
