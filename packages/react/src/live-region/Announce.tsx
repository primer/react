import {announceFromElement} from '@primer/live-region-element'
import type React from 'react'
import {useEffect, useRef, useState, type ElementRef} from 'react'
import {useEffectOnce} from '../internal/hooks/useEffectOnce'
import {useEffectCallback} from '../internal/hooks/useEffectCallback'
import type {PolymorphicProps} from '../utils/polymorphic2'

export type AnnounceProps<As extends React.ElementType> = PolymorphicProps<
  'div',
  As,
  {
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
     * Provide a delay in milliseconds before the announcement is made. This will
     * only work with `polite` announcements
     */
    delayMs?: number

    /**
     * The politeness level to use for the announcement
     * @default 'polite'
     */
    politeness?: 'assertive' | 'polite'
  }
>

/**
 * `Announce` is a component that will announce the text content of the
 * `children` passed in to screen readers using the given politeness level. It
 * will also announce any changes to the text content of `children`
 */
export function Announce<As extends React.ElementType = 'div'>(props: AnnounceProps<As>) {
  const {
    as: BaseComponent = 'div',
    announceOnShow = true,
    children,
    delayMs,
    hidden = false,
    politeness = 'polite',
    ...rest
  } = props
  const ref = useRef<ElementRef<'div'>>(null)
  const [previousAnnouncementText, setPreviousAnnouncementText] = useState<string | null>(null)
  const savedAnnouncement = useRef<ReturnType<typeof announceFromElement> | null>(null)
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
    if (textContent === previousAnnouncementText) {
      return
    }

    savedAnnouncement.current?.cancel()
    savedAnnouncement.current = announceFromElement(
      element,
      politeness === 'assertive'
        ? {
            politeness,
          }
        : {
            politeness,
            delayMs,
          },
    )
    setPreviousAnnouncementText(textContent)
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
      childList: true,
      characterData: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [announce])

  useEffect(() => {
    return () => {
      if (savedAnnouncement.current !== null) {
        savedAnnouncement.current.cancel()
        savedAnnouncement.current = null
      }
    }
  }, [])

  return (
    <BaseComponent {...rest} ref={ref}>
      {children}
    </BaseComponent>
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
