import {announceFromElement} from '@primer/live-region-element'
import React, {useEffect, useRef, useState, type ElementRef} from 'react'
import Box from '../Box'
import {useEffectOnce} from '../internal/hooks/useEffectOnce'
import {useEffectCallback} from '../internal/hooks/useEffectCallback'

export type AnnounceProps = React.ComponentPropsWithoutRef<typeof Box> & {
  /**
   * Specify if the content of the element should be announced when this
   * component is rendered and is not hidden
   * @default false
   */
  announceOnShow?: boolean

  /**
   * Specify if the element is hidden
   * @default false
   */
  hidden?: boolean

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
export function Announce({
  announceOnShow = true,
  children,
  hidden = false,
  politeness = 'polite',
  ...rest
}: AnnounceProps) {
  const ref = useRef<ElementRef<'div'>>(null)
  const [previousAnnouncement, setPreviousAnnouncement] = useState<string | null>(null)
  const announce = useEffectCallback(() => {
    const {current: element} = ref
    if (!element) {
      return
    }

    if (hidden) {
      return
    }

    const style = window.getComputedStyle(element)
    if (style.display === 'none') {
      return
    }

    if (style.visibility === 'hidden') {
      return
    }

    const textContent = getTextContent(element)
    if (textContent === previousAnnouncement) {
      return
    }

    announceFromElement(element, {
      politeness,
    })
    setPreviousAnnouncement(textContent)
  })

  // Announce the initial message, this is wrapped in `useEffectOnce` so that it
  // does not announce twice in StrictMode
  useEffectOnce(() => {
    if (announceOnShow) {
      announce()
    }
  })

  useEffect(() => {
    const {current: container} = ref
    if (container === null) {
      return
    }

    // When the text of the container changes, announce the new text
    const observer = new MutationObserver(() => {
      announce()
    })

    observer.observe(container, {
      subtree: true,
      characterData: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [announce])

  return (
    <Box {...rest} ref={ref}>
      {children}
    </Box>
  )
}

function getTextContent(element: HTMLElement): string {
  let value = ''
  if (element.hasAttribute('aria-label')) {
    value = element.getAttribute('aria-label')!
  } else if (element.textContent) {
    value = element.textContent
  }
  return value ? value.trim() : ''
}
